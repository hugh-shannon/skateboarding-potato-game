class PlayingScene {
    constructor(game) {
        this.game = game;
        this.renderer = new Renderer(game);
        this.levelManager = new LevelManager(game);
        this.scoring = new ScoringSystem(game);
        this.particles = new ParticleSystem();
        this.player = new Player(game);
    }

    enter(data) {
        this.currentLevelIndex = (data && data.level !== undefined) ? data.level : 0;
        this.lives = this.game.getStartingLives();
        this.coins = 0;
        this.scoring.reset();
        this.particles.reset();
        this.player.reset();

        this.cameraX = 0;
        this.paused = false;
        this.levelComplete = false;
        this.levelCompleteTimer = 0;
        this.levelIntroTimer = 2.5;
        this.grindSparkTimer = 0;

        this.loadLevel(this.currentLevelIndex);

        this.scrollSpeed = this.levelData.scrollSpeed;
        if (this.game.getSlowStart()) {
            this.scrollSpeed *= 0.75;
            this.slowStartTimer = 3;
        } else {
            this.slowStartTimer = 0;
        }
    }

    loadLevel(index) {
        const data = this.levelManager.instantiateLevel(index);
        if (!data) {
            this.game.switchScene('gameover', {
                score: Math.floor(this.scoring.score),
                coins: this.coins,
                level: this.currentLevelIndex
            });
            return;
        }

        this.levelData = data;
        this.obstacles = data.obstacles;
        this.rails = data.rails;
        this.levelCoins = data.coins;
        this.levelLength = data.length;
        this.levelName = data.name;
        this.levelSubtitle = data.subtitle;
        this.player.reset();
        this.cameraX = 0;
    }

    exit() {}

    update(dt) {
        if (this.game.input.wasJustPressed('Escape')) {
            this.paused = !this.paused;
        }

        if (this.paused) return;

        if (this.levelIntroTimer > 0) {
            this.levelIntroTimer -= dt;
            return;
        }

        if (this.levelComplete) {
            this.levelCompleteTimer += dt;
            if (this.levelCompleteTimer > 3) {
                this.currentLevelIndex++;
                if (this.currentLevelIndex >= this.levelManager.getTotalLevels()) {
                    this.game.switchScene('gameover', {
                        score: Math.floor(this.scoring.score),
                        coins: this.coins,
                        level: this.currentLevelIndex,
                        victory: true
                    });
                } else {
                    this.levelIntroTimer = 2.5;
                    this.levelComplete = false;
                    this.levelCompleteTimer = 0;
                    this.loadLevel(this.currentLevelIndex);
                    this.scrollSpeed = this.levelData.scrollSpeed;
                    if (this.game.getSlowStart()) {
                        this.scrollSpeed *= 0.75;
                        this.slowStartTimer = 3;
                    }
                }
            }
            this.particles.update(dt);
            this.scoring.update(dt, true);
            return;
        }

        if (this.slowStartTimer > 0) {
            this.slowStartTimer -= dt;
            if (this.slowStartTimer <= 0) {
                this.scrollSpeed = this.levelData.scrollSpeed;
            }
        }

        this.cameraX += this.scrollSpeed * dt;
        this.player.worldX = this.cameraX + this.player.screenX;
        this.player.update(dt, this.game.input);

        this.checkCollisions();
        this.updateCoins(dt);

        this.particles.update(dt);
        this.scoring.update(dt, this.player.isGrounded && !this.player.isGrinding);

        if (this.player.isGrinding) {
            this.scoring.addGrindScore(dt);
            this.grindSparkTimer += dt;
            if (this.grindSparkTimer > 0.05) {
                this.grindSparkTimer = 0;
                this.particles.emitSparks(
                    this.player.screenX + 20,
                    this.player.y + this.player.height + this.player.boardHeight
                );
            }
        }

        if (this.cameraX >= this.levelLength) {
            this.completeLevel();
        }
    }

    checkCollisions() {
        const playerBounds = this.player.getBounds();

        for (const obs of this.obstacles) {
            const obsBounds = obs.getBounds();
            if (Physics.aabbOverlap(playerBounds, obsBounds)) {
                if (this.player.hit()) {
                    this.lives--;
                    this.particles.emitHitBurst(this.player.screenX, this.player.y + this.player.height / 2);
                    if (this.lives <= 0) {
                        this.game.audio.playSFX('gameover');
                        this.game.switchScene('gameover', {
                            score: Math.floor(this.scoring.score),
                            coins: this.coins,
                            level: this.currentLevelIndex
                        });
                        return;
                    }
                }
            } else {
                const dist = Math.abs(playerBounds.x + playerBounds.w - obsBounds.x);
                if (dist < 25 && dist > 20 && playerBounds.y + playerBounds.h <= obsBounds.y + 5) {
                    this.scoring.addNearMissScore(this.player.screenX, this.player.y);
                }
            }
        }

        if (!this.player.isGrinding && !this.player.isGrounded && this.player.vy > 0) {
            for (const rail of this.rails) {
                const railBounds = rail.getBounds();
                if (Physics.aabbTopCollision(playerBounds, railBounds, 15)) {
                    this.player.startGrind(rail);
                    this.scoring.startGrindCombo();
                    break;
                }
            }
        }

        const result = this.checkTrickLanding();
        if (result) {
            if (result.bail) {
                if (this.player.hit()) {
                    this.lives--;
                    this.particles.emitHitBurst(this.player.screenX, this.player.y);
                    if (this.lives <= 0) {
                        this.game.audio.playSFX('gameover');
                        this.game.switchScene('gameover', {
                            score: Math.floor(this.scoring.score),
                            coins: this.coins,
                            level: this.currentLevelIndex
                        });
                    }
                }
            }
        }
    }

    checkTrickLanding() {
        return null;
    }

    updateCoins(dt) {
        const playerBounds = this.player.getBounds();
        const magnetRange = this.game.getCoinMagnetRange();

        for (const coin of this.levelCoins) {
            if (coin.collected) continue;
            coin.update(dt);

            const dx = this.player.worldX - coin.x;
            const dy = (this.player.y + this.player.height / 2) - coin.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < magnetRange && dist > 20) {
                const pullStrength = 300 * dt;
                coin.x += (dx / dist) * pullStrength;
                coin.y += (dy / dist) * pullStrength;
            }

            const coinBounds = coin.getBounds();
            if (Physics.aabbOverlap(playerBounds, coinBounds)) {
                coin.collected = true;
                this.coins++;
                this.game.audio.playSFX('coin');
                const screenCoinX = coin.x - this.cameraX;
                this.particles.emitCoinBurst(screenCoinX, coin.y);
            }
        }
    }

    completeLevel() {
        this.levelComplete = true;
        this.levelCompleteTimer = 0;
        this.scoring.addLevelBonus(this.currentLevelIndex);
        this.particles.emitLevelComplete(480, 270);

        if (this.currentLevelIndex + 1 > this.game.levelsUnlocked) {
            this.game.levelsUnlocked = this.currentLevelIndex + 1;
            this.game.persist();
        }
    }

    render(ctx) {
        this.renderer.drawBackground(ctx, this.cameraX);

        for (const rail of this.rails) {
            rail.draw(ctx, this.cameraX);
        }

        for (const coin of this.levelCoins) {
            coin.draw(ctx, this.cameraX);
        }

        for (const obs of this.obstacles) {
            obs.draw(ctx, this.cameraX);
        }

        this.player.draw(ctx);
        this.particles.draw(ctx);
        this.scoring.drawPopups(ctx);
        this.scoring.drawHUD(ctx, this.lives, this.coins, this.levelName);

        if (this.levelIntroTimer > 0) {
            this.drawLevelIntro(ctx);
        }

        if (this.levelComplete) {
            this.drawLevelComplete(ctx);
        }

        if (this.paused) {
            this.drawPaused(ctx);
        }

        Draw.scanlines(ctx, this.game.width, this.game.height);
    }

    drawLevelIntro(ctx) {
        ctx.save();
        const alpha = Math.min(1, this.levelIntroTimer);
        ctx.globalAlpha = alpha;

        ctx.fillStyle = 'rgba(10, 10, 46, 0.7)';
        ctx.fillRect(0, 0, 960, 540);

        const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.05;
        ctx.save();
        ctx.translate(480, 220);
        ctx.scale(pulse, pulse);
        Draw.neonText(ctx, this.levelName, 0, 0, COLORS.NEON_PINK, 28, 'center');
        ctx.restore();

        Draw.neonText(ctx, this.levelSubtitle, 480, 280, COLORS.NEON_CYAN, 12, 'center');
        Draw.neonText(ctx, `LEVEL ${this.currentLevelIndex + 1}`, 480, 180, COLORS.NEON_YELLOW, 14, 'center');

        if (this.levelIntroTimer < 1.5) {
            Draw.neonText(ctx, 'GET READY!', 480, 340, COLORS.NEON_GREEN, 16, 'center');
        }

        ctx.restore();
    }

    drawLevelComplete(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(10, 10, 46, 0.5)';
        ctx.fillRect(0, 0, 960, 540);

        const pulse = 1 + Math.sin(Date.now() * 0.008) * 0.08;
        ctx.save();
        ctx.translate(480, 240);
        ctx.scale(pulse, pulse);
        Draw.neonText(ctx, 'LEVEL COMPLETE!', 0, 0, COLORS.NEON_CYAN, 24, 'center');
        ctx.restore();

        Draw.neonText(ctx, `BONUS: +${(this.currentLevelIndex + 1) * 500}`, 480, 300, COLORS.NEON_YELLOW, 14, 'center');
        ctx.restore();
    }

    drawPaused(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(10, 10, 46, 0.8)';
        ctx.fillRect(0, 0, 960, 540);

        const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.05;
        ctx.save();
        ctx.translate(480, 250);
        ctx.scale(pulse, pulse);
        Draw.neonText(ctx, 'PAUSED', 0, 0, COLORS.NEON_PINK, 32, 'center');
        ctx.restore();

        Draw.neonText(ctx, 'Press ESC to continue', 480, 320, COLORS.NEON_CYAN, 12, 'center');
        ctx.restore();
    }
}
