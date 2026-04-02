class Obstacle {
    constructor(x, type) {
        this.x = x;
        this.type = type;

        const sizes = {
            trash_can: { w: 30, h: 50 },
            hydrant: { w: 24, h: 36 },
            bench: { w: 60, h: 35 },
            cone: { w: 20, h: 30 },
            mailbox: { w: 28, h: 45 }
        };

        const size = sizes[type] || sizes.trash_can;
        this.width = size.w;
        this.height = size.h;
        this.y = Physics.GROUND_Y - this.height;
    }

    getBounds() {
        return { x: this.x, y: this.y, w: this.width, h: this.height };
    }

    draw(ctx, cameraX) {
        const sx = this.x - cameraX;
        if (sx < -100 || sx > 1060) return;

        ctx.save();
        ctx.translate(sx, this.y);
        ctx.strokeStyle = COLORS.PENCIL;
        ctx.lineWidth = 2;

        switch (this.type) {
            case 'trash_can': this.drawTrashCan(ctx); break;
            case 'hydrant': this.drawHydrant(ctx); break;
            case 'bench': this.drawBench(ctx); break;
            case 'cone': this.drawCone(ctx); break;
            case 'mailbox': this.drawMailbox(ctx); break;
        }

        ctx.restore();
    }

    drawTrashCan(ctx) {
        Draw.wobblyRect(ctx, 2, 8, this.width - 4, this.height - 8, 2);

        Draw.wobblyEllipse(ctx, this.width / 2, 6, this.width / 2, 5, 2);

        Draw.wobblyLine(ctx, 4, 22, this.width - 4, 22, 1.5);
        Draw.wobblyLine(ctx, 4, 34, this.width - 4, 34, 1.5);
    }

    drawHydrant(ctx) {
        ctx.strokeStyle = COLORS.CRAYON_RED;
        ctx.lineWidth = 2;

        Draw.wobblyRect(ctx, 4, 10, this.width - 8, this.height - 10, 2);

        Draw.wobblyCircle(ctx, this.width / 2, 6, 5, 2);

        Draw.wobblyRect(ctx, -2, 15, 6, 7, 1.5);
        Draw.wobblyRect(ctx, this.width - 4, 15, 6, 7, 1.5);
    }

    drawBench(ctx) {
        Draw.wobblyLine(ctx, 0, 10, this.width, 10, 2);
        Draw.wobblyLine(ctx, 0, 18, this.width, 18, 2);

        Draw.wobblyLine(ctx, 0, 0, this.width, 0, 2);

        Draw.wobblyLine(ctx, 3, 20, 3, this.height, 2);
        Draw.wobblyLine(ctx, this.width - 3, 20, this.width - 3, this.height, 2);
    }

    drawCone(ctx) {
        ctx.strokeStyle = COLORS.CRAYON_ORANGE;
        ctx.lineWidth = 2;

        Draw.wobblyTriangle(ctx,
            this.width / 2, 0,
            this.width - 2, this.height - 4,
            2, this.height - 4, 2);

        Draw.wobblyLine(ctx, 0, this.height - 4, this.width, this.height - 4, 2);

        ctx.strokeStyle = COLORS.PENCIL;
        Draw.wobblyLine(ctx, 5, 12, this.width - 5, 12, 1.5);
        Draw.wobblyLine(ctx, 7, 20, this.width - 7, 20, 1.5);
    }

    drawMailbox(ctx) {
        ctx.strokeStyle = COLORS.CRAYON_BLUE;
        ctx.lineWidth = 2;

        Draw.wobblyRect(ctx, 2, 12, this.width - 4, this.height - 12, 2);

        ctx.beginPath();
        const baseSeed = Math.floor(this.x * 31.1);
        for (let i = 0; i <= 10; i++) {
            const t = i / 10;
            const angle = Math.PI * t;
            const px = 2 + (this.width - 4) * t;
            const py = 12 - Math.sin(angle) * 8 + (Draw._seededRandom(baseSeed + i) - 0.5) * 2;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();

        ctx.strokeStyle = COLORS.PENCIL;
        Draw.sketchText(ctx, 'MAIL', this.width / 2, this.height - 8, COLORS.PENCIL, 7, 'center');
    }
}
