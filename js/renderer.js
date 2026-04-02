class Renderer {
    constructor(game) {
        this.game = game;
        this.buildings = this.generateBuildings();
    }

    generateBuildings() {
        const buildings = [];
        for (let i = 0; i < 40; i++) {
            buildings.push({
                x: i * 80 + Math.random() * 30,
                width: 35 + Math.random() * 45,
                height: 60 + Math.random() * 140,
                windowRows: Math.floor(Math.random() * 5) + 2,
                windowCols: Math.floor(Math.random() * 2) + 2,
                hasRoof: Math.random() > 0.5
            });
        }
        return buildings;
    }

    drawBackground(ctx, cameraX) {
        const w = this.game.width;
        const h = this.game.height;
        const groundY = 420;

        ctx.fillStyle = COLORS.PAPER_WHITE;
        ctx.fillRect(0, 0, w, h);

        Draw.notebookLines(ctx, w, h);

        this.drawSun(ctx);
        this.drawClouds(ctx, cameraX);
        this.drawSkyline(ctx, cameraX, groundY);
        this.drawGround(ctx, cameraX, groundY);
    }

    drawSun(ctx) {
        ctx.save();
        ctx.strokeStyle = COLORS.CRAYON_YELLOW;
        ctx.lineWidth = 2;
        Draw.wobblyCircle(ctx, 860, 70, 25, 3);

        ctx.lineWidth = 1.5;
        const baseSeed = 42;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const r1 = 30;
            const r2 = 42 + Draw._seededRandom(baseSeed + i) * 8;
            Draw.wobblyLine(ctx,
                860 + Math.cos(angle) * r1, 70 + Math.sin(angle) * r1,
                860 + Math.cos(angle) * r2, 70 + Math.sin(angle) * r2, 2);
        }
        ctx.restore();
    }

    drawClouds(ctx, cameraX) {
        ctx.save();
        ctx.strokeStyle = COLORS.PENCIL_LIGHT;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.4;

        const cloudPositions = [
            { x: 150, y: 60 }, { x: 450, y: 45 }, { x: 700, y: 80 }
        ];

        for (const cloud of cloudPositions) {
            const cx = ((cloud.x - cameraX * 0.03) % 1100 + 1100) % 1100 - 70;
            Draw.wobblyEllipse(ctx, cx, cloud.y, 40, 15, 3);
            Draw.wobblyEllipse(ctx, cx - 20, cloud.y + 5, 25, 12, 3);
            Draw.wobblyEllipse(ctx, cx + 22, cloud.y + 3, 28, 13, 3);
        }
        ctx.restore();
    }

    drawSkyline(ctx, cameraX, groundY) {
        const parallax = cameraX * 0.15;

        ctx.save();
        ctx.strokeStyle = COLORS.PENCIL_LIGHT;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.35;

        for (const b of this.buildings) {
            const sx = ((b.x - parallax) % 3200 + 3200) % 3200 - 200;
            const sy = groundY - b.height;

            Draw.wobblyRect(ctx, sx, sy, b.width, b.height, 2);

            if (b.hasRoof) {
                Draw.wobblyLine(ctx, sx, sy, sx + b.width / 2, sy - 15, 2);
                Draw.wobblyLine(ctx, sx + b.width / 2, sy - 15, sx + b.width, sy, 2);
            }

            const winW = 6;
            const winH = 8;
            const winSpaceX = b.width / (b.windowCols + 1);
            const winSpaceY = (b.height - 15) / (b.windowRows + 1);

            for (let wy = 0; wy < b.windowRows; wy++) {
                for (let wx = 0; wx < b.windowCols; wx++) {
                    const winX = sx + winSpaceX * (wx + 1) - winW / 2;
                    const winY = sy + winSpaceY * (wy + 1);
                    if (winY < groundY - 10) {
                        Draw.wobblyRect(ctx, winX, winY, winW, winH, 1);
                    }
                }
            }
        }
        ctx.restore();
    }

    drawGround(ctx, cameraX, groundY) {
        const w = this.game.width;
        const h = this.game.height;

        ctx.save();
        ctx.strokeStyle = COLORS.PENCIL;
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        const baseSeed = 777;
        const segWidth = 30;
        for (let x = 0; x <= w; x += segWidth) {
            const wobble = (Draw._seededRandom(baseSeed + Math.floor((x + cameraX) / segWidth) * 3) - 0.5) * 3;
            if (x === 0) {
                ctx.moveTo(x, groundY + wobble);
            } else {
                ctx.lineTo(x, groundY + wobble);
            }
        }
        ctx.stroke();

        ctx.strokeStyle = COLORS.CRAYON_GREEN;
        ctx.lineWidth = 1.5;
        const grassSeed = 333;
        const grassSpacing = 25;
        const grassOffset = (-cameraX * 0.5) % grassSpacing;

        for (let x = grassOffset; x < w; x += grassSpacing) {
            const s = Math.floor((x + cameraX) / grassSpacing);
            const r1 = Draw._seededRandom(grassSeed + s * 7);
            const r2 = Draw._seededRandom(grassSeed + s * 13);
            const gx = x + r1 * 10;
            const gy = groundY - 1;
            const gh = 5 + r2 * 8;

            ctx.beginPath();
            ctx.moveTo(gx - 3, gy);
            ctx.lineTo(gx - 1 + r1 * 2, gy - gh);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(gx + 3, gy);
            ctx.lineTo(gx + 1 + r2 * 2, gy - gh * 0.7);
            ctx.stroke();
        }

        Draw.scribbleFill(ctx, 0, groundY + 3, w, h - groundY - 3, COLORS.CRAYON_GREEN, 8);

        ctx.restore();
    }
}
