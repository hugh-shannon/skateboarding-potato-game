class LevelManager {
    constructor(game) {
        this.game = game;
        this.levels = this.defineLevels();
        this.currentLevel = 0;
    }

    defineLevels() {
        return [
            {
                name: 'DOWNTOWN',
                subtitle: 'The streets are calling!',
                scrollSpeed: 300,
                length: 8000,
                bgColor: '#0a0a2e',
                entities: this.buildDowntown()
            },
            {
                name: 'INDUSTRIAL',
                subtitle: 'Watch out for heavy stuff!',
                scrollSpeed: 350,
                length: 10000,
                bgColor: '#0a1a1e',
                entities: this.buildIndustrial()
            },
            {
                name: 'BOARDWALK',
                subtitle: 'Surf and turf, spud style!',
                scrollSpeed: 380,
                length: 11000,
                bgColor: '#0a0a3e',
                entities: this.buildBoardwalk()
            },
            {
                name: 'HIGHWAY',
                subtitle: 'Full speed ahead!',
                scrollSpeed: 430,
                length: 12000,
                bgColor: '#1a0a1e',
                entities: this.buildHighway()
            },
            {
                name: 'NEON CITY',
                subtitle: 'The ultimate radical run!',
                scrollSpeed: 480,
                length: 14000,
                bgColor: '#0a0020',
                entities: this.buildNeonCity()
            }
        ];
    }

    buildDowntown() {
        const entities = { obstacles: [], rails: [], coins: [] };
        let x = 600;

        x = this.addCoinArc(entities, x, 5);
        x += 200;
        entities.obstacles.push({ x, type: 'cone' });
        x += 250;
        this.addCoinRow(entities, x, 4, Physics.GROUND_Y - 60);
        x += 300;
        entities.obstacles.push({ x, type: 'trash_can' });
        x += 200;
        entities.rails.push({ x, width: 200, y: Physics.GROUND_Y - 30 });
        this.addCoinRow(entities, x + 20, 4, Physics.GROUND_Y - 60);
        x += 400;
        entities.obstacles.push({ x, type: 'hydrant' });
        x += 150;
        entities.obstacles.push({ x, type: 'cone' });
        x += 300;
        x = this.addCoinArc(entities, x, 6);
        x += 200;
        entities.obstacles.push({ x, type: 'bench' });
        x += 350;
        entities.rails.push({ x, width: 250, y: Physics.GROUND_Y - 35 });
        this.addCoinRow(entities, x + 30, 5, Physics.GROUND_Y - 65);
        x += 400;
        entities.obstacles.push({ x, type: 'trash_can' });
        x += 180;
        entities.obstacles.push({ x, type: 'cone' });
        x += 300;
        x = this.addCoinArc(entities, x, 5);
        x += 200;
        entities.obstacles.push({ x, type: 'mailbox' });
        x += 350;
        entities.rails.push({ x, width: 180, y: Physics.GROUND_Y - 28 });
        x += 300;
        entities.obstacles.push({ x, type: 'hydrant' });
        x += 200;
        x = this.addCoinArc(entities, x, 7);
        x += 250;
        entities.obstacles.push({ x, type: 'bench' });
        x += 200;
        entities.obstacles.push({ x, type: 'cone' });

        return entities;
    }

    buildIndustrial() {
        const entities = { obstacles: [], rails: [], coins: [] };
        let x = 500;

        entities.obstacles.push({ x, type: 'trash_can' });
        x += 180;
        entities.obstacles.push({ x, type: 'trash_can' });
        x += 300;
        entities.rails.push({ x, width: 300, y: Physics.GROUND_Y - 35 });
        this.addCoinRow(entities, x + 20, 6, Physics.GROUND_Y - 65);
        x += 450;
        entities.obstacles.push({ x, type: 'hydrant' });
        x += 130;
        entities.obstacles.push({ x, type: 'cone' });
        x += 130;
        entities.obstacles.push({ x, type: 'hydrant' });
        x += 300;
        x = this.addCoinArc(entities, x, 8);
        x += 200;
        entities.obstacles.push({ x, type: 'bench' });
        x += 200;
        entities.rails.push({ x, width: 200, y: Physics.GROUND_Y - 40 });
        this.addCoinRow(entities, x + 20, 4, Physics.GROUND_Y - 70);
        x += 350;
        entities.obstacles.push({ x, type: 'mailbox' });
        x += 140;
        entities.obstacles.push({ x, type: 'trash_can' });
        x += 300;
        x = this.addCoinArc(entities, x, 6);
        x += 200;
        entities.rails.push({ x, width: 350, y: Physics.GROUND_Y - 32 });
        this.addCoinRow(entities, x + 20, 7, Physics.GROUND_Y - 62);
        x += 500;
        entities.obstacles.push({ x, type: 'hydrant' });
        x += 150;
        entities.obstacles.push({ x, type: 'cone' });
        x += 150;
        entities.obstacles.push({ x, type: 'trash_can' });
        x += 300;
        x = this.addCoinArc(entities, x, 7);
        x += 200;
        entities.obstacles.push({ x, type: 'bench' });
        x += 250;
        entities.obstacles.push({ x, type: 'mailbox' });

        return entities;
    }

    buildBoardwalk() {
        const entities = { obstacles: [], rails: [], coins: [] };
        let x = 500;

        entities.rails.push({ x, width: 250, y: Physics.GROUND_Y - 25 });
        this.addCoinRow(entities, x + 20, 5, Physics.GROUND_Y - 55);
        x += 400;
        entities.obstacles.push({ x, type: 'bench' });
        x += 250;
        x = this.addCoinArc(entities, x, 6);
        x += 200;
        entities.obstacles.push({ x, type: 'cone' });
        x += 120;
        entities.obstacles.push({ x, type: 'cone' });
        x += 300;
        entities.rails.push({ x, width: 400, y: Physics.GROUND_Y - 30 });
        this.addCoinRow(entities, x + 20, 8, Physics.GROUND_Y - 60);
        x += 550;
        entities.obstacles.push({ x, type: 'hydrant' });
        x += 180;
        entities.obstacles.push({ x, type: 'trash_can' });
        x += 180;
        entities.obstacles.push({ x, type: 'hydrant' });
        x += 300;
        x = this.addCoinArc(entities, x, 7);
        x += 200;
        entities.rails.push({ x, width: 300, y: Physics.GROUND_Y - 38 });
        this.addCoinRow(entities, x + 20, 6, Physics.GROUND_Y - 68);
        x += 450;
        entities.obstacles.push({ x, type: 'bench' });
        x += 150;
        entities.obstacles.push({ x, type: 'bench' });
        x += 300;
        entities.obstacles.push({ x, type: 'mailbox' });
        x += 200;
        x = this.addCoinArc(entities, x, 8);
        x += 200;
        entities.rails.push({ x, width: 200, y: Physics.GROUND_Y - 35 });
        x += 350;
        entities.obstacles.push({ x, type: 'cone' });
        x += 120;
        entities.obstacles.push({ x, type: 'trash_can' });
        x += 120;
        entities.obstacles.push({ x, type: 'cone' });

        return entities;
    }

    buildHighway() {
        const entities = { obstacles: [], rails: [], coins: [] };
        let x = 400;

        entities.obstacles.push({ x, type: 'cone' });
        x += 100;
        entities.obstacles.push({ x, type: 'cone' });
        x += 100;
        entities.obstacles.push({ x, type: 'cone' });
        x += 250;
        entities.rails.push({ x, width: 250, y: Physics.GROUND_Y - 30 });
        this.addCoinRow(entities, x + 20, 5, Physics.GROUND_Y - 60);
        x += 350;
        entities.obstacles.push({ x, type: 'trash_can' });
        x += 120;
        entities.obstacles.push({ x, type: 'hydrant' });
        x += 120;
        entities.obstacles.push({ x, type: 'mailbox' });
        x += 300;
        x = this.addCoinArc(entities, x, 9);
        x += 200;
        entities.obstacles.push({ x, type: 'bench' });
        x += 180;
        entities.obstacles.push({ x, type: 'bench' });
        x += 300;
        entities.rails.push({ x, width: 350, y: Physics.GROUND_Y - 35 });
        this.addCoinRow(entities, x + 20, 7, Physics.GROUND_Y - 65);
        x += 450;
        entities.obstacles.push({ x, type: 'hydrant' });
        x += 110;
        entities.obstacles.push({ x, type: 'cone' });
        x += 110;
        entities.obstacles.push({ x, type: 'hydrant' });
        x += 110;
        entities.obstacles.push({ x, type: 'cone' });
        x += 300;
        x = this.addCoinArc(entities, x, 8);
        x += 200;
        entities.rails.push({ x, width: 280, y: Physics.GROUND_Y - 40 });
        this.addCoinRow(entities, x + 20, 6, Physics.GROUND_Y - 70);
        x += 400;
        entities.obstacles.push({ x, type: 'trash_can' });
        x += 100;
        entities.obstacles.push({ x, type: 'trash_can' });
        x += 100;
        entities.obstacles.push({ x, type: 'trash_can' });
        x += 300;
        x = this.addCoinArc(entities, x, 7);
        x += 200;
        entities.obstacles.push({ x, type: 'mailbox' });
        x += 130;
        entities.obstacles.push({ x, type: 'bench' });

        return entities;
    }

    buildNeonCity() {
        const entities = { obstacles: [], rails: [], coins: [] };
        let x = 400;

        x = this.addCoinArc(entities, x, 8);
        x += 150;
        entities.obstacles.push({ x, type: 'hydrant' });
        x += 100;
        entities.obstacles.push({ x, type: 'trash_can' });
        x += 100;
        entities.obstacles.push({ x, type: 'hydrant' });
        x += 250;
        entities.rails.push({ x, width: 300, y: Physics.GROUND_Y - 35 });
        this.addCoinRow(entities, x + 20, 6, Physics.GROUND_Y - 65);
        x += 400;
        entities.obstacles.push({ x, type: 'cone' });
        x += 90;
        entities.obstacles.push({ x, type: 'cone' });
        x += 90;
        entities.obstacles.push({ x, type: 'cone' });
        x += 90;
        entities.obstacles.push({ x, type: 'cone' });
        x += 300;
        x = this.addCoinArc(entities, x, 10);
        x += 200;
        entities.rails.push({ x, width: 400, y: Physics.GROUND_Y - 30 });
        this.addCoinRow(entities, x + 20, 8, Physics.GROUND_Y - 60);
        x += 500;
        entities.obstacles.push({ x, type: 'bench' });
        x += 130;
        entities.obstacles.push({ x, type: 'mailbox' });
        x += 130;
        entities.obstacles.push({ x, type: 'bench' });
        x += 300;
        entities.obstacles.push({ x, type: 'trash_can' });
        x += 100;
        entities.obstacles.push({ x, type: 'hydrant' });
        x += 100;
        entities.obstacles.push({ x, type: 'trash_can' });
        x += 100;
        entities.obstacles.push({ x, type: 'hydrant' });
        x += 300;
        x = this.addCoinArc(entities, x, 9);
        x += 200;
        entities.rails.push({ x, width: 350, y: Physics.GROUND_Y - 38 });
        this.addCoinRow(entities, x + 20, 7, Physics.GROUND_Y - 68);
        x += 450;
        entities.obstacles.push({ x, type: 'mailbox' });
        x += 110;
        entities.obstacles.push({ x, type: 'bench' });
        x += 110;
        entities.obstacles.push({ x, type: 'mailbox' });
        x += 110;
        entities.obstacles.push({ x, type: 'hydrant' });
        x += 300;
        entities.rails.push({ x, width: 500, y: Physics.GROUND_Y - 32 });
        this.addCoinRow(entities, x + 20, 10, Physics.GROUND_Y - 62);
        x += 600;
        x = this.addCoinArc(entities, x, 10);
        x += 200;
        entities.obstacles.push({ x, type: 'cone' });
        x += 80;
        entities.obstacles.push({ x, type: 'trash_can' });
        x += 80;
        entities.obstacles.push({ x, type: 'cone' });
        x += 80;
        entities.obstacles.push({ x, type: 'trash_can' });
        x += 80;
        entities.obstacles.push({ x, type: 'cone' });

        return entities;
    }

    addCoinRow(entities, x, count, y) {
        for (let i = 0; i < count; i++) {
            entities.coins.push({ x: x + i * 35, y });
        }
    }

    addCoinArc(entities, startX, count) {
        const spacing = 30;
        for (let i = 0; i < count; i++) {
            const t = i / (count - 1);
            const arcY = Physics.GROUND_Y - 60 - Math.sin(t * Math.PI) * 80;
            entities.coins.push({ x: startX + i * spacing, y: arcY });
        }
        return startX + (count - 1) * spacing;
    }

    getLevel(index) {
        if (index >= this.levels.length) return null;
        return this.levels[index];
    }

    getTotalLevels() {
        return this.levels.length;
    }

    instantiateLevel(index) {
        const level = this.getLevel(index);
        if (!level) return null;

        const luckySpud = this.game.getLuckySpud();
        const obstacles = [];
        const rails = [];
        const coins = [];

        for (const o of level.entities.obstacles) {
            if (luckySpud && Math.random() < 0.1) {
                coins.push(new Coin(o.x, Physics.GROUND_Y - 60));
            } else {
                obstacles.push(new Obstacle(o.x, o.type));
            }
        }

        for (const r of level.entities.rails) {
            rails.push(new Rail(r.x, r.width, r.y));
        }

        for (const c of level.entities.coins) {
            coins.push(new Coin(c.x, c.y));
        }

        return { obstacles, rails, coins, scrollSpeed: level.scrollSpeed, length: level.length, name: level.name, subtitle: level.subtitle };
    }
}
