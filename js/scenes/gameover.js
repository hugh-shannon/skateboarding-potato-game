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
                case 0:
                    this.game.switchScene('store');
                    break;
                case 1:
                    this.game.audio.startMusic();
                    this.game.switchScene('playing', { level: 0 });
                    break;
                case 2:
                    this.game.switchScene('menu');
                    break;
            }
        }
    }

    render(ctx) {
        const w = this.game.width;
        const h = this.game.height;

        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#0a0a2e');
        grad.addColorStop(0.5, '#2a0020');
        grad.addColorStop(1, '#0a0a2e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        const title = this.victory ? 'TOTALLY RADICAL!' : 'GAME OVER';
        const titleColor = this.victory ? COLORS.NEON_GREEN : COLORS.NEON_RED;

        const flicker = this.victory ? 1 : (Math.sin(this.animTimer * 8) > -0.3 ? 1 : 0.3);
        ctx.save();
        ctx.globalAlpha = flicker;
        const pulse = 1 + Math.sin(this.animTimer * 3) * 0.05;
        ctx.translate(w / 2, 80);
        ctx.scale(pulse, pulse);
        Draw.neonText(ctx, title, 0, 0, titleColor, 32, 'center');
        ctx.restore();

        if (this.victory) {
            Draw.neonText(ctx, 'You beat all 5 levels!', w / 2, 130, COLORS.NEON_CYAN, 12, 'center');
        }

        const statsY = 170;
        Draw.neonText(ctx, 'SCORE', w / 2, statsY, COLORS.NEON_CYAN, 12, 'center');
        Draw.neonText(ctx, `${this.score}`, w / 2, statsY + 30, COLORS.NEON_YELLOW, 20, 'center');

        Draw.neonText(ctx, 'COINS EARNED', w / 2, statsY + 70, COLORS.NEON_CYAN, 12, 'center');
        Draw.neonText(ctx, `${this.coins}`, w / 2, statsY + 100, COLORS.GOLD, 20, 'center');

        Draw.neonText(ctx, `LEVELS CLEARED: ${this.level}`, w / 2, statsY + 140, COLORS.NEON_GREEN, 10, 'center');

        Draw.neonText(ctx, `TOTAL COINS: ${this.game.totalCoins}`, w / 2, statsY + 170, COLORS.GOLD, 10, 'center');

        if (this.score >= this.game.highScore && this.score > 0) {
            const hsBlink = Math.sin(this.animTimer * 6) > 0;
            if (hsBlink) {
                Draw.neonText(ctx, 'NEW HIGH SCORE!', w / 2, statsY + 200, COLORS.NEON_PINK, 14, 'center');
            }
        }

        for (let i = 0; i < this.options.length; i++) {
            const y = 430 + i * 35;
            const selected = i === this.selectedOption;
            const color = selected ? COLORS.NEON_YELLOW : COLORS.NEON_CYAN;
            const size = selected ? 14 : 11;

            if (selected) {
                const blink = Math.sin(this.animTimer * 6) > 0;
                if (blink) {
                    Draw.neonText(ctx, '>', w / 2 - 120, y, COLORS.NEON_PINK, 14, 'center');
                }
            }

            Draw.neonText(ctx, this.options[i], w / 2, y, color, size, 'center');
        }

        Draw.scanlines(ctx, w, h);
    }
}
