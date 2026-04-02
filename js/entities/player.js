class Player {
    constructor(game) {
        this.game = game;
        this.screenX = 180;
        this.width = 40;
        this.height = 44;
        this.boardWidth = 48;
        this.boardHeight = 8;

        this.reset();
    }

    reset() {
        this.worldX = 200;
        this.y = Physics.GROUND_Y - this.height - this.boardHeight;
        this.vy = 0;
        this.isGrounded = true;
        this.isGrinding = false;
        this.grindRail = null;

        this.trickState = 'none';
        this.trickTimer = 0;
        this.trickDuration = 0.4;
        this.trickRotation = 0;
        this.currentTrickName = '';

        this.invulnerableTimer = 0;
        this.visible = true;
        this.blinkTimer = 0;

        this.expression = 'normal';
        this.squashStretch = 1;
    }

    getBounds() {
        return {
            x: this.worldX,
            y: this.y,
            w: this.width,
            h: this.height + this.boardHeight,
            vy: this.vy
        };
    }

    update(dt, input) {
        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer -= dt;
            this.blinkTimer += dt;
            this.visible = Math.floor(this.blinkTimer * 10) % 2 === 0;
        } else {
            this.visible = true;
        }

        if (this.isGrinding) {
            this.updateGrinding(dt);
            return;
        }

        if (this.isGrounded && input.wasJustPressed('Space')) {
            this.jump();
        }

        if (!this.isGrounded) {
            this.updateAirborne(dt, input);
        }

        if (!this.isGrounded) {
            this.vy += Physics.GRAVITY * dt;
            this.y += this.vy * dt;

            const groundLevel = Physics.GROUND_Y - this.height - this.boardHeight;
            if (this.y >= groundLevel) {
                this.land(groundLevel);
            }
        }

        this.updateSquashStretch(dt);
    }

    jump() {
        this.vy = Physics.JUMP_VELOCITY * this.game.getJumpMultiplier();
        this.isGrounded = false;
        this.expression = 'happy';
        this.squashStretch = 1.3;
        this.game.audio.playSFX('jump');
    }

    updateAirborne(dt, input) {
        if (this.trickState === 'none') {
            if (input.wasJustPressed('ArrowRight')) {
                this.startTrick('kickflip', 150);
            } else if (input.wasJustPressed('ArrowLeft')) {
                this.startTrick('heelflip', 150);
            } else if (input.wasJustPressed('ArrowDown')) {
                this.startTrick('360flip', 300);
            } else if (input.wasJustPressed('ArrowUp')) {
                this.startTrick('nosegrab', 200);
            }
        }

        if (this.trickState !== 'none') {
            this.trickTimer += dt;
            const progress = Math.min(this.trickTimer / this.trickDuration, 1);

            if (this.trickState === 'kickflip' || this.trickState === 'heelflip') {
                const dir = this.trickState === 'kickflip' ? 1 : -1;
                this.trickRotation = dir * progress * Math.PI * 2;
            } else if (this.trickState === '360flip') {
                this.trickRotation = progress * Math.PI * 4;
            } else if (this.trickState === 'nosegrab') {
                this.trickRotation = Math.sin(progress * Math.PI) * 0.5;
            }

            if (this.trickTimer >= this.trickDuration) {
                this.completeTrick();
            }
        }
    }

    startTrick(name, points) {
        this.trickState = name;
        this.trickTimer = 0;
        this.trickRotation = 0;
        this.trickPoints = points;

        const names = {
            kickflip: 'KICKFLIP',
            heelflip: 'HEELFLIP',
            '360flip': '360 FLIP',
            nosegrab: 'NOSE GRAB'
        };
        this.currentTrickName = names[name] || name.toUpperCase();
        this.expression = 'focused';
    }

    completeTrick() {
        const completedTrick = this.trickState;
        const completedName = this.currentTrickName;
        const completedPoints = this.trickPoints;

        this.trickState = 'none';
        this.trickTimer = 0;
        this.trickRotation = 0;

        this.game.audio.playSFX('trick');
        this.expression = 'happy';

        return { name: completedName, points: completedPoints };
    }

    land(groundLevel) {
        this.y = groundLevel;
        this.vy = 0;
        this.isGrounded = true;
        this.squashStretch = 0.7;
        this.expression = 'normal';

        if (this.trickState !== 'none') {
            this.trickState = 'none';
            this.trickRotation = 0;
            return { bail: true };
        }

        this.game.audio.playSFX('land');
        return { bail: false };
    }

    startGrind(rail) {
        this.isGrinding = true;
        this.isGrounded = false;
        this.grindRail = rail;
        this.y = rail.y - this.height - this.boardHeight;
        this.vy = 0;
        this.trickState = 'none';
        this.trickRotation = 0;
        this.expression = 'cool';
        this.game.audio.playSFX('grind');
    }

    updateGrinding(dt) {
        if (this.grindRail) {
            this.y = this.grindRail.y - this.height - this.boardHeight;

            const railEnd = this.grindRail.x + this.grindRail.width;
            if (this.worldX > railEnd - 10) {
                this.endGrind();
            }
        }
    }

    endGrind() {
        this.isGrinding = false;
        this.grindRail = null;
        this.vy = Physics.JUMP_VELOCITY * 0.4;
        this.isGrounded = false;
        this.expression = 'happy';
    }

    hit() {
        if (this.invulnerableTimer > 0) return false;
        this.invulnerableTimer = 2;
        this.blinkTimer = 0;
        this.expression = 'hurt';
        this.game.audio.playSFX('hit');

        if (this.isGrinding) {
            this.isGrinding = false;
            this.grindRail = null;
        }

        this.vy = Physics.JUMP_VELOCITY * 0.3;
        this.isGrounded = false;
        return true;
    }

    updateSquashStretch(dt) {
        this.squashStretch += (1 - this.squashStretch) * 8 * dt;
    }

    draw(ctx) {
        if (!this.visible) return;

        ctx.save();

        const cx = this.screenX + this.width / 2;
        const cy = this.y + this.height / 2;

        ctx.translate(cx, cy);
        ctx.rotate(this.trickRotation);
        ctx.scale(1 / this.squashStretch, this.squashStretch);
        ctx.translate(-this.width / 2, -this.height / 2);

        this.drawPotato(ctx);
        ctx.restore();

        ctx.save();
        ctx.translate(cx, this.y + this.height);
        ctx.rotate(this.trickRotation * 0.5);
        this.drawSkateboard(ctx);
        ctx.restore();
    }

    drawPotato(ctx) {
        const skin = this.game.equippedSkin;
        const colors = this.getSkinColors(skin);

        ctx.fillStyle = colors.main;
        ctx.beginPath();
        ctx.ellipse(this.width / 2, this.height / 2, this.width / 2 - 2, this.height / 2 - 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = colors.highlight;
        ctx.beginPath();
        ctx.ellipse(this.width / 2 - 5, this.height / 2 - 8, 6, 4, -0.3, 0, Math.PI * 2);
        ctx.fill();

        if (skin === 'neon_tater') {
            ctx.save();
            ctx.strokeStyle = COLORS.NEON_PINK;
            ctx.shadowColor = COLORS.NEON_PINK;
            ctx.shadowBlur = 10;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(this.width / 2, this.height / 2, this.width / 2 - 2, this.height / 2 - 2, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        this.drawFace(ctx);
        this.drawLimbs(ctx);
    }

    getSkinColors(skin) {
        const skins = {
            classic: { main: COLORS.POTATO_BROWN, highlight: COLORS.POTATO_LIGHT },
            hot_potato: { main: '#cc3300', highlight: '#ff6633' },
            cool_spud: { main: '#4488cc', highlight: '#66aaee' },
            golden: { main: COLORS.GOLD, highlight: '#ffee88' },
            neon_tater: { main: '#220044', highlight: '#330066' },
            baked: { main: '#888888', highlight: '#aaaaaa' },
            french_fry: { main: '#ddaa33', highlight: '#eecc55' },
            galaxy: { main: '#220055', highlight: '#4400aa' }
        };
        return skins[skin] || skins.classic;
    }

    drawFace(ctx) {
        const eyeY = this.height / 2 - 4;

        ctx.fillStyle = COLORS.WHITE;
        ctx.beginPath();
        ctx.ellipse(this.width / 2 - 6, eyeY, 4, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.width / 2 + 6, eyeY, 4, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = COLORS.BLACK;
        const pupilOffset = this.expression === 'hurt' ? 0 : 1;
        ctx.beginPath();
        ctx.arc(this.width / 2 - 5 + pupilOffset, eyeY, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.width / 2 + 7 + pupilOffset, eyeY, 2, 0, Math.PI * 2);
        ctx.fill();

        if (this.game.equippedSkin === 'cool_spud') {
            ctx.fillStyle = '#222222';
            ctx.fillRect(this.width / 2 - 14, eyeY - 2, 28, 6);
            ctx.fillStyle = '#444488';
            ctx.fillRect(this.width / 2 - 12, eyeY - 1, 10, 4);
            ctx.fillRect(this.width / 2 + 2, eyeY - 1, 10, 4);
        }

        const mouthY = this.height / 2 + 8;
        ctx.strokeStyle = COLORS.BLACK;
        ctx.lineWidth = 2;
        ctx.beginPath();

        if (this.expression === 'happy') {
            ctx.arc(this.width / 2, mouthY, 5, 0, Math.PI);
        } else if (this.expression === 'hurt') {
            ctx.arc(this.width / 2, mouthY + 5, 5, Math.PI, 0);
        } else if (this.expression === 'cool') {
            ctx.moveTo(this.width / 2 - 5, mouthY);
            ctx.lineTo(this.width / 2 + 5, mouthY);
        } else if (this.expression === 'focused') {
            ctx.arc(this.width / 2, mouthY, 3, 0, Math.PI * 2);
        } else {
            ctx.arc(this.width / 2, mouthY, 4, 0.2, Math.PI - 0.2);
        }
        ctx.stroke();
    }

    drawLimbs(ctx) {
        ctx.strokeStyle = COLORS.POTATO_DARK;
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(4, this.height / 2);
        ctx.lineTo(-4, this.height / 2 + 8);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.width - 4, this.height / 2);
        ctx.lineTo(this.width + 4, this.height / 2 + 8);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.width / 2 - 8, this.height - 4);
        ctx.lineTo(this.width / 2 - 10, this.height + 4);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.width / 2 + 8, this.height - 4);
        ctx.lineTo(this.width / 2 + 10, this.height + 4);
        ctx.stroke();
    }

    drawSkateboard(ctx) {
        ctx.fillStyle = '#663300';
        Draw.roundedRect(ctx, -this.boardWidth / 2, 0, this.boardWidth, this.boardHeight, 3);
        ctx.fill();

        ctx.fillStyle = COLORS.NEON_PINK;
        ctx.fillRect(-this.boardWidth / 2 + 4, 2, this.boardWidth - 8, 4);

        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.arc(-this.boardWidth / 2 + 8, this.boardHeight + 2, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.boardWidth / 2 - 8, this.boardHeight + 2, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#555555';
        ctx.beginPath();
        ctx.arc(-this.boardWidth / 2 + 8, this.boardHeight + 2, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.boardWidth / 2 - 8, this.boardHeight + 2, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}
