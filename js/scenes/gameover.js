class GameOverScene {
    constructor(game) {
        this.game = game;
        this.selectedOption = 0;
        this.options = ['GO TO STORE', 'PLAY AGAIN', 'MAIN MENU'];
        this.animTimer = 0;
        this.score = 0;
        this.coins = 0;
        this.level = 0;
        this.victory = false;
    }

    enter(data) {
        this.score = data ? data.score : 0;
        this.coins = data ? data.coins : 0;
        this.level = data ? data.level : 0;
        this.victory = data ? data.victory : false;
        this.selectedOption = 0;
        this.animTimer = 0;

        this.game.totalCoins += this.coins;
        if (this.score > this.game.highScore) {
            this.game.highScore = this.score;
        }
        this.game.persist();
        this.game.audio.stopMusic();
    }

    exit() {}

    update(dt) {
        this.animTimer += dt;
        const input = this.game.input;

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
                case 0: this.game.switchScene('store'); break;
                case 1:
                    this.game.audio.startMusic();
                    this.game.switchScene('playing', { level: 0 });
                    break;
                case 2: this.game.switchScene('menu'); break;
            }
        }
    }

    render(ctx) {
        const w = this.game.width;
        const h = this.game.height;

        ctx.fillStyle = COLORS.PAPER_WHITE;
        ctx.fillRect(0, 0, w, h);
        Draw.notebookLines(ctx, w, h);

        const title = this.victory ? 'TOTALLY RADICAL!' : 'GAME OVER';
        const titleColor = this.victory ? COLORS.CRAYON_GREEN : COLORS.CRAYON_RED;

        const wobble = Math.sin(this.animTimer * 2) * 0.03;
        ctx.save();
        ctx.translate(w / 2, 80);
        ctx.rotate(wobble);
        Draw.sketchText(ctx, title, 0, 0, titleColor, 36, 'center');
        ctx.restore();

        if (this.victory) {
            Draw.sketchText(ctx, 'You beat all 5 levels!', w / 2, 130, COLORS.CRAYON_BLUE, 14, 'center');
        }

        const statsY = 170;
        Draw.sketchText(ctx, 'SCORE', w / 2, statsY, COLORS.CRAYON_BLUE, 14, 'center');
        Draw.sketchText(ctx, `${this.score}`, w / 2, statsY + 30, COLORS.PENCIL, 24, 'center');

        Draw.sketchText(ctx, 'COINS EARNED', w / 2, statsY + 70, COLORS.CRAYON_BLUE, 14, 'center');
        Draw.sketchText(ctx, `${this.coins}`, w / 2, statsY + 100, COLORS.GOLD_CRAYON, 24, 'center');

        Draw.sketchText(ctx, `Levels Cleared: ${this.level}`, w / 2, statsY + 140, COLORS.CRAYON_GREEN, 13, 'center');
        Draw.sketchText(ctx, `Total Coins: ${this.game.totalCoins}`, w / 2, statsY + 170, COLORS.GOLD_CRAYON, 13, 'center');

        if (this.score >= this.game.highScore && this.score > 0) {
            const blink = Math.sin(this.animTimer * 6) > 0;
            if (blink) {
                Draw.sketchText(ctx, 'NEW HIGH SCORE!', w / 2, statsY + 200, COLORS.CRAYON_PINK, 18, 'center');
            }
        }

        for (let i = 0; i < this.options.length; i++) {
            const y = 430 + i * 35;
            const selected = i === this.selectedOption;
            const color = selected ? COLORS.CRAYON_RED : COLORS.PENCIL;
            const size = selected ? 18 : 15;

            if (selected) {
                ctx.save();
                ctx.strokeStyle = COLORS.CRAYON_RED;
                ctx.lineWidth = 2;
                Draw.wobblyArrow(ctx, w / 2 - 130, y, 16, 2);
                ctx.restore();
            }

            Draw.sketchText(ctx, this.options[i], w / 2, y, color, size, 'center');
        }
    }
}
