class Renderer {
    constructor(game) {
        this.game = game;
        this.cameraX = 0;
        this.buildings = this.generateBuildings();
    }

    generateBuildings() {
        const buildings = [];
        for (let i = 0; i < 40; i++) {
            buildings.push({
                x: i * 80 + Math.random() * 30,
                width: 40 + Math.random() * 50,
                height: 80 + Math.random() * 180,
                color: Math.random() > 0.5 ? '#1a0033' : '#120028',
                windows: Math.floor(Math.random() * 8) + 2,
                neonWindow: Math.floor(Math.random() * 10)
            });
        }
        return buildings;
    }

    drawBackground(ctx, cameraX) {
        const w = this.game.width;
        const h = this.game.height;
        const groundY = 420;

        const grad = ctx.createLinearGradient(0, 0, 0, groundY);
        grad.addColorStop(0, '#0a0a2e');
        grad.addColorStop(0.5, '#1a0033');
        grad.addColorStop(1, '#0d0d3b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, groundY);

        this.drawSkyline(ctx, cameraX, groundY);
        this.drawRetroGrid(ctx, cameraX, groundY);
        this.drawStreet(ctx, cameraX, groundY);
    }

    drawSkyline(ctx, cameraX, groundY) {
        const parallax = cameraX * 0.15;

        ctx.save();
        for (const b of this.buildings) {
            const sx = ((b.x - parallax) % 3200 + 3200) % 3200 - 200;
            const sy = groundY - b.height;

            ctx.fillStyle = b.color;
            ctx.fillRect(sx, sy, b.width, b.height);

            ctx.fillStyle = '#0a0a1e';
            for (let wy = 0; wy < b.windows; wy++) {
                for (let wx = 0; wx < 3; wx++) {
                    const winX = sx + 6 + wx * (b.width / 3 - 2);
                    const winY = sy + 10 + wy * 20;
                    if (winY < groundY - 10) {
                        const isNeon = (wy * 3 + wx) === b.neonWindow;
                        if (isNeon) {
                            const neonColors = [COLORS.NEON_PINK, COLORS.NEON_CYAN, COLORS.NEON_YELLOW, COLORS.NEON_GREEN];
                            const nc = neonColors[Math.floor(b.x) % neonColors.length];
                            ctx.shadowColor = nc;
                            ctx.shadowBlur = 8;
                            ctx.fillStyle = nc;
                            ctx.fillRect(winX, winY, 8, 10);
                            ctx.shadowBlur = 0;
                        } else {
                            ctx.fillStyle = Math.random() > 0.97 ? '#333355' : '#0a0a1e';
                            ctx.fillRect(winX, winY, 8, 10);
                        }
                    }
                }
            }
        }
        ctx.restore();
    }

    drawRetroGrid(ctx, cameraX, groundY) {
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.strokeStyle = COLORS.NEON_PINK;
        ctx.lineWidth = 1;

        const horizonY = groundY - 60;
        const gridOffset = (cameraX * 0.3) % 60;

        for (let i = -5; i < 20; i++) {
            const x = i * 60 - gridOffset;
            const spread = (x - 480) * 2;
            ctx.beginPath();
            ctx.moveTo(480 + (x - 480) * 0.1, horizonY);
            ctx.lineTo(480 + spread, groundY);
            ctx.stroke();
        }

        for (let i = 0; i < 6; i++) {
            const t = i / 5;
            const y = horizonY + (groundY - horizonY) * t * t;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(960, y);
            ctx.stroke();
        }

        ctx.restore();
    }

    drawStreet(ctx, cameraX, groundY) {
        const w = this.game.width;
        const h = this.game.height;

        ctx.fillStyle = COLORS.STREET_DARK;
        ctx.fillRect(0, groundY, w, h - groundY);

        ctx.fillStyle = COLORS.SIDEWALK;
        ctx.fillRect(0, groundY, w, 4);

        ctx.fillStyle = '#444466';
        const dashOffset = (-cameraX * 0.5) % 60;
        for (let x = dashOffset; x < w; x += 60) {
            ctx.fillRect(x, groundY + 50, 30, 3);
        }
    }
}
