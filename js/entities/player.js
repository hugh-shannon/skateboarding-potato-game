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
        const fillColor = this.getSkinFillColor(skin);

        Draw.scribbleFill(ctx, 3, 3, this.width - 6, this.height - 6, fillColor, 5);

        ctx.strokeStyle = COLORS.PENCIL;
        ctx.lineWidth = 2;
        Draw.wobblyEllipse(ctx, this.width / 2, this.height / 2, this.width / 2 - 2, this.height / 2 - 2, 2);

        this.drawSkinExtras(ctx, skin);
        this.drawFace(ctx);
        this.drawLimbs(ctx);
    }

    getSkinFillColor(skin) {
        const fills = {
            classic: COLORS.POTATO_BROWN,
            crayon_spud: COLORS.CRAYON_RED,
            stick_figure: COLORS.PENCIL_LIGHT,
            princess: COLORS.CRAYON_PINK,
            robot: COLORS.PENCIL_LIGHT,
            superhero: COLORS.CRAYON_BLUE,
            rainbow: COLORS.CRAYON_YELLOW,
            doodle: COLORS.POTATO_BROWN
        };
        return fills[skin] || fills.classic;
    }

    drawSkinExtras(ctx, skin) {
        ctx.save();
        ctx.strokeStyle = COLORS.PENCIL;
        ctx.lineWidth = 1.5;

        if (skin === 'crayon_spud') {
            ctx.strokeStyle = COLORS.CRAYON_BLUE;
            Draw.wobblyLine(ctx, 8, 8, 32, 12, 2);
            ctx.strokeStyle = COLORS.CRAYON_GREEN;
            Draw.wobblyLine(ctx, 10, 18, 30, 22, 2);
            ctx.strokeStyle = COLORS.CRAYON_PURPLE;
            Draw.wobblyLine(ctx, 12, 28, 28, 32, 2);
        } else if (skin === 'princess') {
            ctx.strokeStyle = COLORS.CRAYON_YELLOW;
            Draw.wobblyTriangle(ctx, this.width / 2 - 8, -2, this.width / 2, -12, this.width / 2 + 8, -2, 2);
            Draw.wobblyLine(ctx, this.width / 2 - 3, -8, this.width / 2 - 3, -5, 1);
            Draw.wobblyLine(ctx, this.width / 2 + 3, -8, this.width / 2 + 3, -5, 1);
        } else if (skin === 'robot') {
            ctx.strokeStyle = COLORS.PENCIL;
            Draw.wobblyRect(ctx, 5, 5, this.width - 10, this.height - 10, 2);
            Draw.wobblyLine(ctx, this.width / 2, -4, this.width / 2, 2, 1);
            Draw.wobblyCircle(ctx, this.width / 2, -6, 3, 1);
        } else if (skin === 'superhero') {
            ctx.strokeStyle = COLORS.CRAYON_RED;
            ctx.lineWidth = 2;
            Draw.wobblyTriangle(ctx, this.width - 2, 10, this.width + 15, 5, this.width + 12, 25, 3);
        } else if (skin === 'rainbow') {
            const t = Math.floor(Date.now() / 500);
            const rainbowColors = [COLORS.CRAYON_RED, COLORS.CRAYON_ORANGE, COLORS.CRAYON_YELLOW, COLORS.CRAYON_GREEN, COLORS.CRAYON_BLUE, COLORS.CRAYON_PURPLE];
            const idx = t % rainbowColors.length;
            Draw.scribbleFill(ctx, 3, 3, this.width - 6, this.height - 6, rainbowColors[idx], 5);
        } else if (skin === 'doodle') {
            ctx.strokeStyle = COLORS.PENCIL;
            ctx.lineWidth = 1;
            Draw.wobblyStarDoodle(ctx, 10, 10, 4);
            Draw.wobblyStarDoodle(ctx, 30, 15, 3);
            Draw.wobblyStarDoodle(ctx, 15, 30, 3);
            Draw.wobblyStarDoodle(ctx, 28, 35, 4);
            // hearts
            ctx.beginPath();
            ctx.moveTo(22, 8);
            ctx.lineTo(20, 5);
            ctx.lineTo(18, 8);
            ctx.lineTo(22, 12);
            ctx.lineTo(26, 8);
            ctx.lineTo(24, 5);
            ctx.lineTo(22, 8);
            ctx.stroke();
        }

        ctx.restore();
    }

    drawFace(ctx) {
        const eyeY = this.height / 2 - 4;

        ctx.fillStyle = COLORS.BLACK;
        ctx.beginPath();
        ctx.arc(this.width / 2 - 6, eyeY, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.width / 2 + 6, eyeY, 2.5, 0, Math.PI * 2);
        ctx.fill();

        const mouthY = this.height / 2 + 8;
        ctx.strokeStyle = COLORS.BLACK;
        ctx.lineWidth = 2;

        if (this.expression === 'happy') {
            Draw.wobblyLine(ctx, this.width / 2 - 5, mouthY, this.width / 2, mouthY + 4, 1);
            Draw.wobblyLine(ctx, this.width / 2, mouthY + 4, this.width / 2 + 5, mouthY, 1);
        } else if (this.expression === 'hurt') {
            Draw.wobblyLine(ctx, this.width / 2 - 5, mouthY + 4, this.width / 2, mouthY, 1);
            Draw.wobblyLine(ctx, this.width / 2, mouthY, this.width / 2 + 5, mouthY + 4, 1);
        } else if (this.expression === 'cool') {
            Draw.wobblyLine(ctx, this.width / 2 - 5, mouthY, this.width / 2 + 5, mouthY, 1);
        } else if (this.expression === 'focused') {
            ctx.strokeStyle = COLORS.BLACK;
            Draw.wobblyCircle(ctx, this.width / 2, mouthY, 3, 1);
        } else {
            Draw.wobblyLine(ctx, this.width / 2 - 4, mouthY, this.width / 2, mouthY + 2, 1);
            Draw.wobblyLine(ctx, this.width / 2, mouthY + 2, this.width / 2 + 4, mouthY, 1);
        }
    }

    drawLimbs(ctx) {
        ctx.strokeStyle = COLORS.PENCIL;
        ctx.lineWidth = 2;

        Draw.wobblyLine(ctx, 4, this.height / 2, -4, this.height / 2 + 10, 2);
        Draw.wobblyLine(ctx, this.width - 4, this.height / 2, this.width + 4, this.height / 2 + 10, 2);

        Draw.wobblyLine(ctx, this.width / 2 - 8, this.height - 4, this.width / 2 - 10, this.height + 6, 2);
        Draw.wobblyLine(ctx, this.width / 2 + 8, this.height - 4, this.width / 2 + 10, this.height + 6, 2);
    }

    drawSkateboard(ctx) {
        ctx.strokeStyle = COLORS.PENCIL;
        ctx.lineWidth = 2;
        Draw.wobblyRect(ctx, -this.boardWidth / 2, 0, this.boardWidth, this.boardHeight, 2);

        Draw.wobblyCircle(ctx, -this.boardWidth / 2 + 8, this.boardHeight + 3, 4, 1.5);
        Draw.wobblyCircle(ctx, this.boardWidth / 2 - 8, this.boardHeight + 3, 4, 1.5);
    }
}
