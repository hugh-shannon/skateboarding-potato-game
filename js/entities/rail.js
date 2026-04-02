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
        ctx.strokeStyle = COLORS.PENCIL;
        ctx.lineWidth = 2;

        Draw.wobblyLine(ctx, sx, this.y + this.height / 2, sx + this.width, this.y + this.height / 2, 2);

        Draw.wobblyLine(ctx, sx + 3, this.y + this.height, sx + 3, Physics.GROUND_Y, 2);
        Draw.wobblyLine(ctx, sx + this.width - 3, this.y + this.height, sx + this.width - 3, Physics.GROUND_Y, 2);

        if (this.width > 150) {
            Draw.wobblyLine(ctx, sx + this.width / 2, this.y + this.height, sx + this.width / 2, Physics.GROUND_Y, 2);
        }

        ctx.restore();
    }
}
