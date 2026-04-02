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
        if (this.messageTimer > 0) this.messageTimer -= dt;

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
                this.showMessage('EQUIPPED!', COLORS.CRAYON_GREEN);
                this.game.audio.playSFX('coin');
            } else {
                this.showMessage('ALREADY OWNED', COLORS.CRAYON_BLUE);
            }
            return;
        }

        if (item.requires && !this.game.purchasedItems.includes(item.requires)) {
            const reqItem = STORE_ITEMS.upgrades.find(u => u.id === item.requires);
            this.showMessage(`REQUIRES ${reqItem ? reqItem.name.toUpperCase() : 'PREREQUISITE'}`, COLORS.CRAYON_RED);
            this.game.audio.playSFX('hit');
            return;
        }

        if (this.game.totalCoins < item.price) {
            this.showMessage('NOT ENOUGH COINS!', COLORS.CRAYON_RED);
            this.game.audio.playSFX('hit');
            return;
        }

        this.game.totalCoins -= item.price;
        this.game.purchasedItems.push(item.id);

        if (this.selectedTab === 0) {
            this.game.equippedSkin = item.id;
        }

        this.game.persist();
        this.showMessage('PURCHASED!', COLORS.CRAYON_GREEN);
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

        ctx.fillStyle = COLORS.PAPER_WHITE;
        ctx.fillRect(0, 0, w, h);
        Draw.notebookLines(ctx, w, h);

        Draw.sketchText(ctx, 'SPUD SHOP', w / 2, 40, COLORS.CRAYON_PURPLE, 32, 'center');
        Draw.sketchText(ctx, `Coins: ${this.game.totalCoins}`, w - 20, 40, COLORS.GOLD_CRAYON, 14, 'right');

        for (let i = 0; i < this.tabs.length; i++) {
            const tabX = 300 + i * 200;
            const selected = i === this.selectedTab;
            const color = selected ? COLORS.CRAYON_RED : COLORS.PENCIL_LIGHT;

            Draw.sketchText(ctx, this.tabs[i], tabX, 85, color, selected ? 18 : 15, 'center');

            if (selected) {
                ctx.save();
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                Draw.wobblyLine(ctx, tabX - 50, 98, tabX + 50, 98, 3);
                ctx.restore();
            }
        }

        Draw.sketchText(ctx, 'LEFT/RIGHT: Switch tabs', 480, 85, COLORS.PENCIL_LIGHT, 10, 'center');

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
                ctx.save();
                ctx.strokeStyle = COLORS.PENCIL_LIGHT;
                ctx.lineWidth = 1;
                Draw.wobblyRect(ctx, 50, y - 5, w - 100, itemHeight - 4, 2);
                ctx.restore();

                ctx.save();
                ctx.strokeStyle = COLORS.CRAYON_RED;
                ctx.lineWidth = 2;
                Draw.wobblyArrow(ctx, 55, y + 12, 14, 2);
                ctx.restore();
            }

            const nameColor = selected ? COLORS.PENCIL : COLORS.PENCIL_LIGHT;
            Draw.sketchText(ctx, item.name, 85, y + 8, nameColor, 13, 'left');

            Draw.sketchText(ctx, item.description, 85, y + 26, COLORS.PENCIL_LIGHT, 10, 'left');

            if (equipped) {
                Draw.sketchText(ctx, 'EQUIPPED', w - 80, y + 12, COLORS.CRAYON_GREEN, 10, 'center');
            } else if (owned) {
                Draw.sketchText(ctx, 'OWNED', w - 80, y + 12, COLORS.CRAYON_BLUE, 10, 'center');
            } else {
                ctx.save();
                ctx.strokeStyle = COLORS.GOLD_CRAYON;
                ctx.lineWidth = 1.5;
                Draw.wobblyCircle(ctx, w - 110, y + 12, 6, 1.5);
                Draw.sketchText(ctx, '$', w - 110, y + 13, COLORS.GOLD_CRAYON, 8, 'center');
                ctx.restore();

                Draw.sketchText(ctx, `${item.price}`, w - 80, y + 12, COLORS.GOLD_CRAYON, 13, 'center');
            }
        }

        if (this.selectedItem < items.length) {
            const item = items[this.selectedItem];
            const owned = this.game.purchasedItems.includes(item.id);
            const equipped = this.selectedTab === 0 && this.game.equippedSkin === item.id;

            let hint = '';
            if (equipped) hint = 'Currently equipped';
            else if (owned && this.selectedTab === 0) hint = 'Press ENTER to equip';
            else if (!owned) hint = 'Press ENTER to buy';

            if (hint) {
                Draw.sketchText(ctx, hint, w / 2, h - 55, COLORS.PENCIL_LIGHT, 12, 'center');
            }
        }

        if (this.messageTimer > 0) {
            const alpha = Math.min(1, this.messageTimer);
            ctx.save();
            ctx.globalAlpha = alpha;
            Draw.sketchText(ctx, this.message, w / 2, h / 2, this.messageColor, 24, 'center');
            ctx.restore();
        }

        Draw.sketchText(ctx, 'ESC: Back to menu', w / 2, h - 25, COLORS.PENCIL_LIGHT, 10, 'center');
    }
}
