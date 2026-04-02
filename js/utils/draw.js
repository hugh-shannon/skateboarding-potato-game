const Draw = {
    neonText(ctx, text, x, y, color, size, align = 'center') {
        ctx.save();
        ctx.font = `${size}px 'Press Start 2P', monospace`;
        ctx.textAlign = align;
        ctx.textBaseline = 'middle';

        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);

        ctx.shadowBlur = 0;
        ctx.fillStyle = COLORS.WHITE;
        ctx.fillText(text, x, y);
        ctx.restore();
    },

    glowRect(ctx, x, y, w, h, color, blur = 10) {
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = blur;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
        ctx.shadowBlur = 0;
        ctx.fillRect(x, y, w, h);
        ctx.restore();
    },

    glowCircle(ctx, x, y, r, color, blur = 10) {
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = blur;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    },

    glowLine(ctx, x1, y1, x2, y2, color, width = 2, blur = 10) {
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = blur;
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    },

    roundedRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    },

    scanlines(ctx, width, height, opacity = 0.05) {
        ctx.save();
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        for (let y = 0; y < height; y += 3) {
            ctx.fillRect(0, y, width, 1);
        }
        ctx.restore();
    }
};
