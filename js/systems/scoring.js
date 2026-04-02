class ScoringSystem {
    constructor(game) {
        this.game = game;
        this.score = 0;
        this.displayScore = 0;
        this.comboCount = 0;
        this.comboTimer = 0;
        this.comboBaseTime = 1.5;
        this.popups = [];
    }

    reset() {
        this.score = 0;
        this.displayScore = 0;
        this.comboCount = 0;
        this.comboTimer = 0;
        this.popups = [];
    }

    getComboMultiplier() {
        if (this.comboCount <= 1) return 1;
        return Math.min(1 + (this.comboCount - 1) * 0.5, 4);
    }

    getComboTimeout() {
        return this.comboBaseTime * this.game.getComboTimerMultiplier();
    }

    addTrickScore(name, basePoints, screenX, screenY) {
        this.comboCount++;
        this.comboTimer = this.getComboTimeout();

        const multiplier = this.getComboMultiplier() * this.game.getScoreMultiplier();
        const points = Math.round(basePoints * multiplier);
        this.score += points;

        this.popups.push({
            text: name,
            points: points,
            x: screenX,
            y: screenY,
            timer: 0,
            duration: 1.2,
            color: COLORS.CRAYON_BLUE
        });

        if (this.comboCount > 1) {
            this.popups.push({
                text: `COMBO x${this.comboCount}!`,
                points: 0,
                x: 480,
                y: 200,
                timer: 0,
                duration: 1.0,
                color: COLORS.CRAYON_RED
            });
        }
    }

    addGrindScore(dt) {
        const pointsPerSec = 100 * this.getComboMultiplier() * this.game.getScoreMultiplier();
        this.score += pointsPerSec * dt;
        this.comboTimer = this.getComboTimeout();
    }

    startGrindCombo() {
        this.comboCount++;
        this.comboTimer = this.getComboTimeout();
    }

    addNearMissScore(screenX, screenY) {
        const points = Math.round(25 * this.game.getScoreMultiplier());
        this.score += points;
        this.popups.push({
            text: 'CLOSE CALL!',
            points: points,
            x: screenX,
            y: screenY,
            timer: 0,
            duration: 0.8,
            color: COLORS.CRAYON_GREEN
        });
    }

    addLevelBonus(levelIndex) {
        const bonus = (levelIndex + 1) * 500;
        this.score += bonus;
        this.popups.push({
            text: 'LEVEL COMPLETE!',
            points: bonus,
            x: 480,
            y: 180,
            timer: 0,
            duration: 2.0,
            color: COLORS.CRAYON_PURPLE
        });
    }

    update(dt, playerGrounded) {
        if (playerGrounded && this.comboTimer > 0) {
            this.comboTimer -= dt;
            if (this.comboTimer <= 0) {
                this.comboCount = 0;
                this.comboTimer = 0;
            }
        }

        this.displayScore += (this.score - this.displayScore) * 5 * dt;
        if (Math.abs(this.score - this.displayScore) < 1) {
            this.displayScore = this.score;
        }

        for (let i = this.popups.length - 1; i >= 0; i--) {
            this.popups[i].timer += dt;
            if (this.popups[i].timer >= this.popups[i].duration) {
                this.popups.splice(i, 1);
            }
        }
    }

    drawHUD(ctx, lives, coins, levelName) {
        Draw.sketchText(ctx, `Score: ${Math.floor(this.displayScore)}`, 940, 30, COLORS.PENCIL, 18, 'right');

        ctx.save();
        ctx.strokeStyle = COLORS.GOLD_CRAYON;
        ctx.lineWidth = 2;
        Draw.wobblyCircle(ctx, 25, 30, 8, 2);
        Draw.sketchText(ctx, '$', 25, 31, COLORS.GOLD_CRAYON, 10, 'center');
        ctx.restore();

        Draw.sketchText(ctx, `${coins}`, 50, 30, COLORS.GOLD_CRAYON, 16, 'left');

        for (let i = 0; i < lives; i++) {
            const lx = 22 + i * 22;
            const ly = 56;
            ctx.save();
            ctx.strokeStyle = COLORS.CRAYON_BROWN;
            ctx.lineWidth = 1.5;
            Draw.wobblyEllipse(ctx, lx, ly, 8, 6, 1.5);
            ctx.fillStyle = COLORS.BLACK;
            ctx.beginPath();
            ctx.arc(lx - 2, ly - 1, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(lx + 2, ly - 1, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        if (levelName) {
            Draw.sketchText(ctx, levelName, 480, 20, COLORS.CRAYON_PURPLE, 14, 'center');
        }

        if (this.comboCount > 1) {
            const pulse = 1 + Math.sin(Date.now() * 0.01) * 0.1;
            ctx.save();
            ctx.translate(480, 80);
            ctx.scale(pulse, pulse);
            Draw.sketchText(ctx, `COMBO x${this.comboCount}`, 0, 0, COLORS.CRAYON_RED, 22, 'center');
            ctx.restore();
        }
    }

    drawPopups(ctx) {
        for (const p of this.popups) {
            const t = p.timer / p.duration;
            const alpha = 1 - t;
            const y = p.y - t * 60;

            ctx.save();
            ctx.globalAlpha = alpha;
            Draw.sketchText(ctx, p.text, p.x, y, p.color, 16, 'center');
            if (p.points > 0) {
                Draw.sketchText(ctx, `+${p.points}`, p.x, y + 18, p.color, 14, 'center');
            }
            ctx.restore();
        }
    }
}
