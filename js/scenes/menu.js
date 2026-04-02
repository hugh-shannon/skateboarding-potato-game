class MenuScene {
    constructor(game) {
        this.game = game;
        this.selectedOption = 0;
        this.options = ['START RUN', 'EASY MODE: OFF', 'STORE', 'CONTROLS'];
        this.showControls = false;
        this.animTimer = 0;
        this.potatoX = 200;
        this.potatoDir = 1;
    }

    enter() {
        this.selectedOption = 0;
        this.showControls = false;
        this.animTimer = 0;
        this.options[1] = this.game.easyMode ? 'EASY MODE: ON' : 'EASY MODE: OFF';
    }

    exit() {}

    update(dt) {
        this.animTimer += dt;

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

        ctx.fillStyle = COLORS.PAPER_WHITE;
        ctx.fillRect(0, 0, w, h);
        Draw.notebookLines(ctx, w, h);

        const wobble = Math.sin(this.animTimer * 1.5) * 0.02;
        ctx.save();
        ctx.translate(w / 2, 120);
        ctx.rotate(wobble);
        Draw.sketchText(ctx, 'SKATE SPUD', 0, 0, COLORS.CRAYON_BLUE, 44, 'center');
        ctx.restore();

        ctx.save();
        ctx.strokeStyle = COLORS.CRAYON_BLUE;
        ctx.lineWidth = 2;
        Draw.wobblyLine(ctx, w / 2 - 160, 145, w / 2 + 160, 145, 3);
        ctx.restore();

        Draw.sketchText(ctx, 'A Totally Radical Potato Adventure', w / 2, 170, COLORS.PENCIL_LIGHT, 14, 'center');

        this.drawMenuPotato(ctx);

        for (let i = 0; i < this.options.length; i++) {
            const y = 310 + i * 42;
            const selected = i === this.selectedOption;
            const isEasyOn = i === 1 && this.game.easyMode;
            const color = isEasyOn ? COLORS.CRAYON_GREEN : (selected ? COLORS.CRAYON_RED : COLORS.PENCIL);
            const size = selected ? 20 : 17;

            if (selected) {
                ctx.save();
                ctx.strokeStyle = COLORS.CRAYON_RED;
                ctx.lineWidth = 2;
                Draw.wobblyArrow(ctx, w / 2 - 140, y, 18, 2);
                ctx.restore();
            }

            Draw.sketchText(ctx, this.options[i], w / 2, y, color, size, 'center');
        }

        Draw.sketchText(ctx, `Coins: ${this.game.totalCoins}`, w - 20, h - 30, COLORS.GOLD_CRAYON, 14, 'right');
        if (this.game.highScore > 0) {
            Draw.sketchText(ctx, `Hi-Score: ${this.game.highScore}`, 20, h - 30, COLORS.CRAYON_GREEN, 14, 'left');
        }

        if (this.showControls) {
            this.drawControlsOverlay(ctx);
        }
    }

    drawMenuPotato(ctx) {
        ctx.save();
        ctx.translate(this.potatoX, 240);

        ctx.strokeStyle = COLORS.PENCIL;
        ctx.lineWidth = 2;
        Draw.wobblyRect(ctx, -24, 22, 48, 8, 2);
        Draw.wobblyCircle(ctx, -16, 32, 4, 1.5);
        Draw.wobblyCircle(ctx, 16, 32, 4, 1.5);

        const bobY = Math.sin(this.animTimer * 4) * 3;
        ctx.translate(0, bobY);

        Draw.scribbleFill(ctx, -18, -20, 36, 40, COLORS.POTATO_BROWN, 5);

        ctx.strokeStyle = COLORS.PENCIL;
        ctx.lineWidth = 2;
        Draw.wobblyEllipse(ctx, 0, 0, 20, 22, 2);

        ctx.fillStyle = COLORS.BLACK;
        ctx.beginPath();
        ctx.arc(-5, -4, 2.5, 0, Math.PI * 2);
        ctx.arc(7, -4, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = COLORS.BLACK;
        ctx.lineWidth = 2;
        Draw.wobblyLine(ctx, -5, 8, 0, 12, 1);
        Draw.wobblyLine(ctx, 0, 12, 5, 8, 1);

        ctx.restore();
    }

    drawControlsOverlay(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(250, 248, 240, 0.92)';
        ctx.fillRect(0, 0, 960, 540);

        Draw.sketchText(ctx, 'CONTROLS', 480, 60, COLORS.CRAYON_RED, 28, 'center');

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
                Draw.sketchText(ctx, controls[i][0], 350, y, COLORS.CRAYON_RED, 13, 'right');
                Draw.sketchText(ctx, controls[i][1], 380, y, COLORS.PENCIL, 13, 'left');
            }
        }

        const blink = Math.sin(Date.now() * 0.005) > 0;
        if (blink) {
            Draw.sketchText(ctx, 'Press ENTER to go back', 480, 490, COLORS.CRAYON_GREEN, 13, 'center');
        }

        ctx.restore();
    }
}
