const Physics = {
    GRAVITY: 2200,
    JUMP_VELOCITY: -700,
    GROUND_Y: 420,

    aabbOverlap(a, b) {
        return a.x < b.x + b.w &&
               a.x + a.w > b.x &&
               a.y < b.y + b.h &&
               a.y + a.h > b.y;
    },

    aabbTopCollision(player, platform, tolerance = 10) {
        const playerBottom = player.y + player.h;
        const prevBottom = playerBottom - player.vy * (1 / 60);

        return player.x + player.w > platform.x &&
               player.x < platform.x + platform.w &&
               playerBottom >= platform.y &&
               playerBottom <= platform.y + tolerance &&
               player.vy >= 0;
    }
};
