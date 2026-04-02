class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y || (Physics.GROUND_Y - 80);
        this.radius = 10;
        this.collected = false;
        this.bobTimer = Math.random() * Math.PI * 2;
        this.sparkleTimer = 0;
    }

    getBounds() {
        return {
            x: this.x - this.radius,
            y: this.y - this.radius,
            w: this.radius * 2,
            h: this.radius * 2
        };
    }

    update(dt) {
        this.bobTimer += dt * 3;
        this.sparkleTimer += dt;
    }

    draw(ctx, cameraX) {
        if (this.collected) return;

        const sx = this.x - cameraX;
        if (sx < -30 || sx > 990) return;

        const bobY = this.y + Math.sin(this.bobTimer) * 4;

        ctx.save();

        ctx.strokeStyle = COLORS.GOLD_CRAYON;
        ctx.lineWidth = 2;
        Draw.wobblyCircle(ctx, sx, bobY, this.radius, 2);

        Draw.sketchText(ctx, '$', sx, bobY + 1, COLORS.GOLD_CRAYON, 10, 'center');

        if (this.sparkleTimer % 1.0 < 0.5) {
            ctx.strokeStyle = COLORS.CRAYON_YELLOW;
            ctx.lineWidth = 1;
            Draw.wobblyStarDoodle(ctx, sx + 8, bobY - 8, 4);
        }

        ctx.restore();
    }
}
