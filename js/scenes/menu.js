class MenuScene {
    constructor(game) {
        this.game = game;
        this.selectedOption = 0;
        this.options = ['START RUN', 'EASY MODE: OFF', 'STORE', 'CONTROLS'];
        this.showControls = false;
        this.animTimer = 0;
        this.potatoX = 200;
        this.potatoDir = 1;
        this.gridOffset = 0;
    }

    enter() {
        this.selectedOption = 0;
        this.showControls = false;
        this.animTimer = 0;
    }

    exit() {}

    update(dt) {
        this.animTimer += dt;
        this.gridOffset += dt * 60;

        this.potatoX += this.potatoDir * 120 * dt;
        if (this.potatoX > 760) this.potatoDir = -1;
        if (this.potatoX < 200) this.potatoDir = 1;

        const input = this.game.input;

        if (this.showControls) {
            if (input.wasJustPressed('Escape') || input.wasJustPressed('Enter')) {
                this.showControls = false;
                this.game.audio.playSFX('select');
            }
            return;
        }

        if (input.wasJustPressed('ArrowUp')) {
            this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
            this.game.audio.playSFX('select');
        }
        if (input.wasJustPressed('ArrowDown')) {
            this.selectedOption = (this.selectedOption + 1) % this.options.length;
            this.game.audio.playSFX('select');
        }

        if (input.wasJustPressed('Enter') || input.wasJustPressed('Space')) {
            this.game.audio.playSFX('select');
            switch (this.selectedOption) {
                case 0:
                    this.game.audio.startMusic();
                    this.game.switchScene('playing', { level: 0 });
                    break;
                case 1:
                    this.game.easyMode = !this.game.easyMode;
                    this.options[1] = this.game.easyMode ? 'EASY MODE: ON' : 'EASY MODE: OFF';
                    break;
                case 2:
                    this.game.switchScene('store');
                    break;
                case 3:
                    this.showControls = true;
                    break;
            }
        }
    }

    render(ctx) {
        const w = this.game.width;
        const h = this.game.height;

        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#0a0a2e');
        grad.addColorStop(0.5, '#1a0033');
        grad.addColorStop(1, '#0a0a2e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        this.drawRetroGrid(ctx);

        const titlePulse = 1 + Math.sin(this.animTimer * 2) * 0.05;
        ctx.save();
        ctx.translate(w / 2, 120);
        ctx.scale(titlePulse, titlePulse);
        Draw.neonText(ctx, 'SKATE SPUD', 0, 0, COLORS.NEON_PINK, 40, 'center');
        ctx.restore();

        const subPulse = 0.8 + Math.sin(this.animTimer * 3 + 1) * 0.2;
        ctx.save();
        ctx.globalAlpha = subPulse;
        Draw.neonText(ctx, 'A Totally Radical Potato Adventure', w / 2, 170, COLORS.NEON_CYAN, 10, 'center');
        ctx.restore();

        this.drawMenuPotato(ctx);

        for (let i = 0; i < this.options.length; i++) {
            const y = 320 + i * 45;
            const selected = i === this.selectedOption;
            const isEasyOn = i === 1 && this.game.easyMode;
            const color = isEasyOn ? COLORS.NEON_GREEN : (selected ? COLORS.NEON_YELLOW : COLORS.NEON_CYAN);
            const size = selected ? 16 : 13;

            if (selected) {
                const blink = Math.sin(this.animTimer * 6) > 0;
                if (blink) {
                    Draw.neonText(ctx, '>', w / 2 - 130, y, COLORS.NEON_PINK, 16, 'center');
                }
            }

            Draw.neonText(ctx, this.options[i], w / 2, y, color, size, 'center');
        }

        Draw.neonText(ctx, `COINS: ${this.game.totalCoins}`, w - 20, h - 30, COLORS.GOLD, 10, 'right');
        if (this.game.highScore > 0) {
            Draw.neonText(ctx, `HI-SCORE: ${this.game.highScore}`, 20, h - 30, COLORS.NEON_GREEN, 10, 'left');
        }

        if (this.showControls) {
            this.drawControlsOverlay(ctx);
        }

        Draw.scanlines(ctx, w, h);
    }

    drawRetroGrid(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = COLORS.NEON_PINK;
        ctx.lineWidth = 1;

        const horizonY = 450;
        const gridOff = this.gridOffset % 60;

        for (let i = -5; i < 20; i++) {
            const x = i * 60 - gridOff;
            const spread = (x - 480) * 1.5;
            ctx.beginPath();
            ctx.moveTo(480 + (x - 480) * 0.1, horizonY);
            ctx.lineTo(480 + spread, 540);
            ctx.stroke();
        }

        for (let i = 0; i < 5; i++) {
            const t = i / 4;
            const y = horizonY + (540 - horizonY) * t * t;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(960, y);
            ctx.stroke();
        }

        ctx.restore();
    }

    drawMenuPotato(ctx) {
        ctx.save();
        ctx.translate(this.potatoX, 240);

        ctx.fillStyle = '#663300';
        Draw.roundedRect(ctx, -24, 22, 48, 8, 3);
        ctx.fill();
        ctx.fillStyle = COLORS.NEON_PINK;
        ctx.fillRect(-20, 24, 40, 4);
        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.arc(-16, 32, 4, 0, Math.PI * 2);
        ctx.arc(16, 32, 4, 0, Math.PI * 2);
        ctx.fill();

        const bobY = Math.sin(this.animTimer * 4) * 3;
        ctx.translate(0, bobY);

        ctx.fillStyle = COLORS.POTATO_BROWN;
        ctx.beginPath();
        ctx.ellipse(0, 0, 20, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = COLORS.POTATO_LIGHT;
        ctx.beginPath();
        ctx.ellipse(-5, -8, 6, 4, -0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = COLORS.WHITE;
        ctx.beginPath();
        ctx.ellipse(-6, -4, 4, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(6, -4, 4, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = COLORS.BLACK;
        ctx.beginPath();
        ctx.arc(-5, -4, 2, 0, Math.PI * 2);
        ctx.arc(7, -4, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = COLORS.BLACK;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 8, 5, 0, Math.PI);
        ctx.stroke();

        ctx.restore();
    }

    drawControlsOverlay(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(10, 10, 46, 0.92)';
        ctx.fillRect(0, 0, 960, 540);

        Draw.neonText(ctx, 'CONTROLS', 480, 60, COLORS.NEON_PINK, 24, 'center');

        const controls = [
            ['SPACE', 'Jump'],
            ['RIGHT ARROW', 'Kickflip (in air)'],
            ['LEFT ARROW', 'Heelflip (in air)'],
            ['DOWN ARROW', '360 Flip (in air)'],
            ['UP ARROW', 'Nose Grab (in air)'],
            ['ESC', 'Pause'],
            ['', ''],
            ['Land on rails', 'to grind for points!'],
            ['Chain tricks', 'for combo multipliers!']
        ];

        for (let i = 0; i < controls.length; i++) {
            const y = 120 + i * 38;
            if (controls[i][0]) {
                Draw.neonText(ctx, controls[i][0], 350, y, COLORS.NEON_YELLOW, 10, 'right');
                Draw.neonText(ctx, controls[i][1], 380, y, COLORS.NEON_CYAN, 10, 'left');
            }
        }

        const blink = Math.sin(Date.now() * 0.005) > 0;
        if (blink) {
            Draw.neonText(ctx, 'Press ENTER to go back', 480, 490, COLORS.NEON_GREEN, 10, 'center');
        }

        ctx.restore();
    }
}
