class StoreScene {
    constructor(game) {
        this.game = game;
        this.selectedTab = 0;
        this.tabs = ['SKINS', 'UPGRADES'];
        this.selectedItem = 0;
        this.animTimer = 0;
        this.message = '';
        this.messageTimer = 0;
    }

    enter() {
        this.selectedTab = 0;
        this.selectedItem = 0;
        this.animTimer = 0;
        this.message = '';
        this.messageTimer = 0;
    }

    exit() {}

    getCurrentItems() {
        return this.selectedTab === 0 ? STORE_ITEMS.skins : STORE_ITEMS.upgrades;
    }

    update(dt) {
        this.animTimer += dt;
        if (this.messageTimer > 0) {
            this.messageTimer -= dt;
        }

        const input = this.game.input;

        if (input.wasJustPressed('Escape')) {
            this.game.audio.playSFX('select');
            this.game.switchScene('menu');
            return;
        }

        if (input.wasJustPressed('ArrowLeft') || input.wasJustPressed('ArrowRight')) {
            this.selectedTab = 1 - this.selectedTab;
            this.selectedItem = 0;
            this.game.audio.playSFX('select');
        }

        const items = this.getCurrentItems();

        if (input.wasJustPressed('ArrowUp')) {
            this.selectedItem = (this.selectedItem - 1 + items.length) % items.length;
            this.game.audio.playSFX('select');
        }
        if (input.wasJustPressed('ArrowDown')) {
            this.selectedItem = (this.selectedItem + 1) % items.length;
            this.game.audio.playSFX('select');
        }

        if (input.wasJustPressed('Enter') || input.wasJustPressed('Space')) {
            this.tryPurchaseOrEquip(items[this.selectedItem]);
        }
    }

    tryPurchaseOrEquip(item) {
        const owned = this.game.purchasedItems.includes(item.id);

        if (owned) {
            if (this.selectedTab === 0) {
                this.game.equippedSkin = item.id;
                this.game.persist();
                this.showMessage('EQUIPPED!', COLORS.NEON_GREEN);
                this.game.audio.playSFX('coin');
            } else {
                this.showMessage('ALREADY OWNED', COLORS.NEON_CYAN);
            }
            return;
        }

        if (item.requires && !this.game.purchasedItems.includes(item.requires)) {
            const reqItem = STORE_ITEMS.upgrades.find(u => u.id === item.requires);
            this.showMessage(`REQUIRES ${reqItem ? reqItem.name.toUpperCase() : 'PREREQUISITE'}`, COLORS.NEON_RED);
            this.game.audio.playSFX('hit');
            return;
        }

        if (this.game.totalCoins < item.price) {
            this.showMessage('NOT ENOUGH COINS!', COLORS.NEON_RED);
            this.game.audio.playSFX('hit');
            return;
        }

        this.game.totalCoins -= item.price;
        this.game.purchasedItems.push(item.id);

        if (this.selectedTab === 0) {
            this.game.equippedSkin = item.id;
        }

        this.game.persist();
        this.showMessage('PURCHASED!', COLORS.NEON_GREEN);
        this.game.audio.playSFX('purchase');
    }

    showMessage(text, color) {
        this.message = text;
        this.messageColor = color;
        this.messageTimer = 1.5;
    }

    render(ctx) {
        const w = this.game.width;
        const h = this.game.height;

        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#0a0a2e');
        grad.addColorStop(0.5, '#0a1a2e');
        grad.addColorStop(1, '#0a0a2e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        Draw.neonText(ctx, 'SPUD SHOP', w / 2, 40, COLORS.NEON_PINK, 28, 'center');

        Draw.neonText(ctx, `COINS: ${this.game.totalCoins}`, w - 20, 40, COLORS.GOLD, 12, 'right');

        for (let i = 0; i < this.tabs.length; i++) {
            const tabX = 240 + i * 240;
            const selected = i === this.selectedTab;
            const color = selected ? COLORS.NEON_YELLOW : '#555577';

            Draw.neonText(ctx, this.tabs[i], tabX, 85, color, selected ? 14 : 12, 'center');

            if (selected) {
                Draw.glowLine(ctx, tabX - 60, 98, tabX + 60, 98, color, 2, 6);
            }
        }

        Draw.neonText(ctx, 'LEFT/RIGHT: Switch tabs', 480, 85, '#444466', 8, 'center');

        const items = this.getCurrentItems();
        const startY = 120;
        const itemHeight = 42;
        const visibleStart = Math.max(0, this.selectedItem - 4);

        for (let i = visibleStart; i < Math.min(items.length, visibleStart + 8); i++) {
            const item = items[i];
            const y = startY + (i - visibleStart) * itemHeight;
            const selected = i === this.selectedItem;
            const owned = this.game.purchasedItems.includes(item.id);
            const equipped = this.selectedTab === 0 && this.game.equippedSkin === item.id;

            if (selected) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.fillRect(50, y - 5, w - 100, itemHeight - 4);

                const blink = Math.sin(this.animTimer * 6) > 0;
                if (blink) {
                    Draw.neonText(ctx, '>', 60, y + 12, COLORS.NEON_PINK, 12, 'left');
                }
            }

            const nameColor = selected ? COLORS.WHITE : '#aaaacc';
            Draw.neonText(ctx, item.name.toUpperCase(), 85, y + 8, nameColor, 10, 'left');

            ctx.save();
            ctx.font = "8px 'Press Start 2P', monospace";
            ctx.fillStyle = '#8888aa';
            ctx.textAlign = 'left';
            ctx.fillText(item.description, 85, y + 26);
            ctx.restore();

            if (equipped) {
                Draw.neonText(ctx, 'EQUIPPED', w - 80, y + 12, COLORS.NEON_GREEN, 8, 'center');
            } else if (owned) {
                Draw.neonText(ctx, this.selectedTab === 0 ? 'OWNED' : 'OWNED', w - 80, y + 12, COLORS.NEON_CYAN, 8, 'center');
            } else {
                Draw.neonText(ctx, `${item.price}`, w - 80, y + 12, COLORS.GOLD, 10, 'center');

                ctx.save();
                ctx.fillStyle = COLORS.GOLD;
                ctx.beginPath();
                ctx.arc(w - 110, y + 12, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#ffee44';
                ctx.font = 'bold 7px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('$', w - 110, y + 13);
                ctx.restore();
            }
        }

        if (this.selectedItem < items.length) {
            const item = items[this.selectedItem];
            const owned = this.game.purchasedItems.includes(item.id);
            const equipped = this.selectedTab === 0 && this.game.equippedSkin === item.id;

            let hint = '';
            if (equipped) {
                hint = 'Currently equipped';
            } else if (owned && this.selectedTab === 0) {
                hint = 'Press ENTER to equip';
            } else if (!owned) {
                hint = 'Press ENTER to buy';
            }

            if (hint) {
                Draw.neonText(ctx, hint, w / 2, h - 55, '#666688', 9, 'center');
            }
        }

        if (this.messageTimer > 0) {
            const alpha = Math.min(1, this.messageTimer);
            ctx.save();
            ctx.globalAlpha = alpha;
            const msgPulse = 1 + Math.sin(this.animTimer * 10) * 0.05;
            ctx.translate(w / 2, h / 2);
            ctx.scale(msgPulse, msgPulse);
            Draw.neonText(ctx, this.message, 0, 0, this.messageColor, 20, 'center');
            ctx.restore();
        }

        Draw.neonText(ctx, 'ESC: Back to menu', w / 2, h - 25, '#444466', 8, 'center');

        Draw.scanlines(ctx, w, h);
    }
}
