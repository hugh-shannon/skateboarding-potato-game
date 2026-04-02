class InputManager {
    constructor() {
        this.keys = new Set();
        this.justPressed = new Set();

        window.addEventListener('keydown', (e) => {
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape'].includes(e.code)) {
                e.preventDefault();
            }
            if (!this.keys.has(e.code)) {
                this.justPressed.add(e.code);
            }
            this.keys.add(e.code);
        });

        window.addEventListener('keyup', (e) => {
            this.keys.delete(e.code);
        });
    }

    isDown(key) {
        return this.keys.has(key);
    }

    wasJustPressed(key) {
        return this.justPressed.has(key);
    }

    endFrame() {
        this.justPressed.clear();
    }
}
