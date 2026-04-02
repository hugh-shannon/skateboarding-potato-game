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

        ctx.shadowColor = COLORS.GOLD;
        ctx.shadowBlur = 12;
        ctx.fillStyle = COLORS.GOLD;
        ctx.beginPath();
        ctx.arc(sx, bobY, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffee44';
        ctx.beginPath();
        ctx.arc(sx, bobY, this.radius - 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = COLORS.GOLD;
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', sx, bobY + 1);

        if (this.sparkleTimer % 0.8 < 0.4) {
            ctx.fillStyle = COLORS.WHITE;
            const sparkX = sx - 3 + Math.sin(this.sparkleTimer * 5) * 2;
            const sparkY = bobY - 4;
            ctx.fillRect(sparkX, sparkY, 2, 2);
        }

        ctx.restore();
    }
}
