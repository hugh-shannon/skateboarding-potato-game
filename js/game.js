class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 960;
        this.height = 540;
        canvas.width = this.width;
        canvas.height = this.height;

        this.input = new InputManager();
        this.audio = new AudioManager();
        this.save = new SaveManager();
        this.easyMode = false;

        this.saveData = this.save.load();
        this.totalCoins = this.saveData.totalCoins;
        this.purchasedItems = this.saveData.purchasedItems;
        this.equippedSkin = this.saveData.equippedSkin;
        this.highScore = this.saveData.highScore;
        this.levelsUnlocked = this.saveData.levelsUnlocked;

        this.scenes = {};
        this.activeScene = null;
        this.lastTime = 0;
        this.accumulator = 0;
        this.fixedDt = 1 / 60;
        this.running = false;
    }

    registerScene(name, scene) {
        this.scenes[name] = scene;
    }

    switchScene(name, data) {
        if (this.activeScene && this.activeScene.exit) {
            this.activeScene.exit();
        }
        this.activeScene = this.scenes[name];
        if (this.activeScene && this.activeScene.enter) {
            this.activeScene.enter(data);
        }
    }

    start() {
        this.running = true;
        this.lastTime = performance.now();
        this.switchScene('menu');
        requestAnimationFrame((t) => this.loop(t));
    }

    loop(timestamp) {
        if (!this.running) return;

        let dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        if (dt > 1 / 30) dt = 1 / 30;

        this.accumulator += dt;

        while (this.accumulator >= this.fixedDt) {
            if (this.activeScene && this.activeScene.update) {
                this.activeScene.update(this.fixedDt);
            }
            this.input.endFrame();
            this.accumulator -= this.fixedDt;
        }

        this.ctx.clearRect(0, 0, this.width, this.height);
        if (this.activeScene && this.activeScene.render) {
            this.activeScene.render(this.ctx);
        }

        requestAnimationFrame((t) => this.loop(t));
    }

    persist() {
        this.save.save({
            totalCoins: this.totalCoins,
            purchasedItems: this.purchasedItems,
            equippedSkin: this.equippedSkin,
            highScore: this.highScore,
            levelsUnlocked: this.levelsUnlocked
        });
    }

    hasUpgrade(id) {
        return this.purchasedItems.includes(id);
    }

    getStartingLives() {
        let lives = 10;
        if (this.hasUpgrade('thick_skin_1')) lives += 1;
        if (this.hasUpgrade('thick_skin_2')) lives += 2;
        return lives;
    }

    getJumpMultiplier() {
        return this.hasUpgrade('air_time') ? 1.15 : 1.0;
    }

    getScoreMultiplier() {
        return this.hasUpgrade('score_boost') ? 1.25 : 1.0;
    }

    getComboTimerMultiplier() {
        return this.hasUpgrade('combo_king') ? 1.5 : 1.0;
    }

    getCoinMagnetRange() {
        return this.hasUpgrade('coin_magnet') ? 120 : 60;
    }

    getSlowStart() {
        return this.hasUpgrade('slow_start');
    }

    getLuckySpud() {
        return this.hasUpgrade('lucky_spud');
    }
}
