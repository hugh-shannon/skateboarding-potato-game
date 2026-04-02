class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    reset() {
        this.particles = [];
    }

    emit(x, y, count, color, config = {}) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x,
                y,
                vx: (config.vx || 0) + (Math.random() - 0.5) * (config.spread || 100),
                vy: (config.vy || -50) + (Math.random() - 0.5) * (config.spread || 100),
                life: config.life || (0.3 + Math.random() * 0.5),
                maxLife: config.life || (0.3 + Math.random() * 0.5),
                size: config.size || (2 + Math.random() * 3),
                color: color,
                gravity: config.gravity !== undefined ? config.gravity : 200
            });
        }
    }

    emitSparks(x, y) {
        this.emit(x, y, 3, COLORS.NEON_YELLOW, {
            vx: -80,
            vy: -30,
            spread: 60,
            life: 0.2,
            size: 2,
            gravity: 300
        });
        this.emit(x, y, 2, COLORS.NEON_ORANGE, {
            vx: -60,
            vy: -40,
            spread: 40,
            life: 0.15,
            size: 1.5,
            gravity: 300
        });
    }

    emitCoinBurst(x, y) {
        this.emit(x, y, 8, COLORS.GOLD, {
            spread: 150,
            vy: -80,
            life: 0.5,
            size: 3,
            gravity: 100
        });
        this.emit(x, y, 4, COLORS.NEON_YELLOW, {
            spread: 100,
            vy: -60,
            life: 0.4,
            size: 2,
            gravity: 100
        });
    }

    emitHitBurst(x, y) {
        this.emit(x, y, 12, COLORS.NEON_RED, {
            spread: 200,
            vy: -100,
            life: 0.6,
            size: 4,
            gravity: 150
        });
    }

    emitLevelComplete(x, y) {
        const colors = [COLORS.NEON_PINK, COLORS.NEON_CYAN, COLORS.NEON_YELLOW, COLORS.NEON_GREEN];
        for (const c of colors) {
            this.emit(x, y, 15, c, {
                spread: 300,
                vy: -150,
                life: 1.5,
                size: 4,
                gravity: 80
            });
        }
    }

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.vy += p.gravity * dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        for (const p of this.particles) {
            const alpha = Math.max(0, p.life / p.maxLife);
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 6;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            ctx.restore();
        }
    }
}
