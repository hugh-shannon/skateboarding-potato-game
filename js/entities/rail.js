class Rail {
    constructor(x, width, y) {
        this.x = x;
        this.width = width;
        this.y = y || (Physics.GROUND_Y - 30);
        this.height = 6;
    }

    getBounds() {
        return { x: this.x, y: this.y, w: this.width, h: this.height };
    }

    draw(ctx, cameraX) {
        const sx = this.x - cameraX;
        if (sx + this.width < -50 || sx > 1010) return;

        ctx.save();

        ctx.fillStyle = '#444466';
        ctx.fillRect(sx, this.y + this.height, 6, Physics.GROUND_Y - this.y - this.height);
        ctx.fillRect(sx + this.width - 6, this.y + this.height, 6, Physics.GROUND_Y - this.y - this.height);

        if (this.width > 150) {
            ctx.fillRect(sx + this.width / 2 - 3, this.y + this.height, 6, Physics.GROUND_Y - this.y - this.height);
        }

        Draw.glowLine(ctx, sx, this.y + 2, sx + this.width, this.y + 2, COLORS.NEON_CYAN, 3, 8);

        ctx.fillStyle = '#666688';
        ctx.fillRect(sx, this.y, this.width, this.height);

        ctx.restore();
    }
}
