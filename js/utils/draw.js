const Draw = {
    _seededRandom(seed) {
        const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
        return x - Math.floor(x);
    },

    _wobbleOffset(baseVal, wobble, seed) {
        return baseVal + (Draw._seededRandom(seed) - 0.5) * wobble;
    },

    wobblyLine(ctx, x1, y1, x2, y2, wobble = 3) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const segments = Math.max(3, Math.floor(dist / 15));

        const nx = -dy / (dist || 1);
        const ny = dx / (dist || 1);

        const baseSeed = Math.floor(x1 * 73.1 + y1 * 37.7 + x2 * 17.3 + y2 * 53.9);

        ctx.beginPath();
        ctx.moveTo(
            Draw._wobbleOffset(x1, wobble * 0.5, baseSeed),
            Draw._wobbleOffset(y1, wobble * 0.5, baseSeed + 1)
        );

        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const bx = x1 + dx * t;
            const by = y1 + dy * t;

            if (i < segments) {
                const offset = (Draw._seededRandom(baseSeed + i * 7) - 0.5) * wobble;
                const px = bx + nx * offset;
                const py = by + ny * offset;
                ctx.lineTo(px, py);
            } else {
                ctx.lineTo(
                    Draw._wobbleOffset(x2, wobble * 0.5, baseSeed + 99),
                    Draw._wobbleOffset(y2, wobble * 0.5, baseSeed + 100)
                );
            }
        }
        ctx.stroke();
    },

    wobblyRect(ctx, x, y, w, h, wobble = 3) {
        Draw.wobblyLine(ctx, x, y, x + w, y, wobble);
        Draw.wobblyLine(ctx, x + w, y, x + w, y + h, wobble);
        Draw.wobblyLine(ctx, x + w, y + h, x, y + h, wobble);
        Draw.wobblyLine(ctx, x, y + h, x, y, wobble);
    },

    wobblyEllipse(ctx, cx, cy, rx, ry, wobble = 2) {
        const points = 20;
        const baseSeed = Math.floor(cx * 51.3 + cy * 29.7 + rx * 13.1 + ry * 7.3);

        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const bx = cx + Math.cos(angle) * rx;
            const by = cy + Math.sin(angle) * ry;
            const offset = (Draw._seededRandom(baseSeed + i * 11) - 0.5) * wobble;
            const px = bx + Math.cos(angle) * offset;
            const py = by + Math.sin(angle) * offset;

            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();
        ctx.stroke();
    },

    wobblyCircle(ctx, cx, cy, r, wobble = 2) {
        Draw.wobblyEllipse(ctx, cx, cy, r, r, wobble);
    },

    wobblyTriangle(ctx, x1, y1, x2, y2, x3, y3, wobble = 3) {
        Draw.wobblyLine(ctx, x1, y1, x2, y2, wobble);
        Draw.wobblyLine(ctx, x2, y2, x3, y3, wobble);
        Draw.wobblyLine(ctx, x3, y3, x1, y1, wobble);
    },

    scribbleFill(ctx, x, y, w, h, color, density = 6) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.5;

        const baseSeed = Math.floor(x * 31.1 + y * 17.3);
        const lines = Math.floor(h / density);

        for (let i = 0; i < lines; i++) {
            const ly = y + i * density + density * 0.5;
            const offset = (Draw._seededRandom(baseSeed + i * 13) - 0.5) * 4;
            Draw.wobblyLine(ctx, x + 2, ly + offset, x + w - 2, ly + offset + (Draw._seededRandom(baseSeed + i * 7) - 0.5) * 3, 2);
        }

        ctx.restore();
    },

    sketchText(ctx, text, x, y, color, size, align = 'center') {
        ctx.save();
        ctx.font = `${size}px 'Patrick Hand', 'Comic Neue', cursive`;
        ctx.textAlign = align;
        ctx.textBaseline = 'middle';
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        ctx.restore();
    },

    notebookLines(ctx, width, height, spacing = 28) {
        ctx.save();
        ctx.strokeStyle = COLORS.PAPER_LINES;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;

        for (let y = spacing; y < height; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        ctx.strokeStyle = COLORS.PAPER_MARGIN;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(60, 0);
        ctx.lineTo(60, height);
        ctx.stroke();

        ctx.restore();
    },

    wobblyArrow(ctx, x, y, size, wobble = 2) {
        Draw.wobblyLine(ctx, x, y, x + size, y, wobble);
        Draw.wobblyLine(ctx, x + size * 0.6, y - size * 0.3, x + size, y, wobble);
        Draw.wobblyLine(ctx, x + size * 0.6, y + size * 0.3, x + size, y, wobble);
    },

    wobblyStarDoodle(ctx, x, y, size) {
        const baseSeed = Math.floor(x * 41.1 + y * 23.7);
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI + Draw._seededRandom(baseSeed + i) * 0.3;
            ctx.moveTo(x - Math.cos(angle) * size, y - Math.sin(angle) * size);
            ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
        }
        ctx.stroke();
    }
};
