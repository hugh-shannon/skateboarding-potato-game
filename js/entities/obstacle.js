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
        ctx.fillStyle = '#667788';
        ctx.fillRect(2, 8, this.width - 4, this.height - 8);

        ctx.fillStyle = '#778899';
        ctx.fillRect(0, 4, this.width, 6);

        ctx.fillStyle = '#889aab';
        ctx.beginPath();
        ctx.ellipse(this.width / 2, 4, this.width / 2, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#556677';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(4, 20);
        ctx.lineTo(this.width - 4, 20);
        ctx.moveTo(4, 32);
        ctx.lineTo(this.width - 4, 32);
        ctx.stroke();
    }

    drawHydrant(ctx) {
        ctx.fillStyle = '#cc2222';
        ctx.fillRect(4, 8, this.width - 8, this.height - 8);

        ctx.fillStyle = '#dd3333';
        ctx.beginPath();
        ctx.ellipse(this.width / 2, 8, this.width / 2 - 2, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#aa1111';
        ctx.fillRect(-2, 14, 6, 8);
        ctx.fillRect(this.width - 4, 14, 6, 8);

        ctx.fillStyle = '#bb2222';
        ctx.beginPath();
        ctx.arc(this.width / 2, 4, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    drawBench(ctx) {
        ctx.fillStyle = '#885533';
        ctx.fillRect(0, 8, this.width, 5);
        ctx.fillRect(0, 16, this.width, 5);

        ctx.fillStyle = '#664422';
        ctx.fillRect(0, 0, this.width, 5);

        ctx.fillStyle = '#333333';
        ctx.fillRect(2, 22, 4, this.height - 22);
        ctx.fillRect(this.width - 6, 22, 4, this.height - 22);
    }

    drawCone(ctx) {
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(this.width / 2, 0);
        ctx.lineTo(this.width - 2, this.height - 4);
        ctx.lineTo(2, this.height - 4);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = COLORS.WHITE;
        ctx.fillRect(4, 10, this.width - 8, 4);
        ctx.fillRect(6, 18, this.width - 12, 3);

        ctx.fillStyle = '#ff6600';
        ctx.fillRect(0, this.height - 4, this.width, 4);
    }

    drawMailbox(ctx) {
        ctx.fillStyle = '#2244aa';
        ctx.fillRect(2, 10, this.width - 4, this.height - 10);

        ctx.fillStyle = '#3355bb';
        ctx.beginPath();
        ctx.ellipse(this.width / 2, 10, this.width / 2 - 2, 8, 0, Math.PI, 0);
        ctx.fill();

        ctx.fillStyle = '#1133aa';
        ctx.fillRect(6, this.height - 20, this.width - 12, 2);

        ctx.fillStyle = COLORS.WHITE;
        ctx.font = '6px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('MAIL', this.width / 2, this.height - 6);
    }
}
