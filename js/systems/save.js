class SaveManager {
    constructor() {
        this.key = 'skatespud_save';
    }

    load() {
        try {
            const data = localStorage.getItem(this.key);
            if (data) {
                const parsed = JSON.parse(data);
                return {
                    totalCoins: parsed.totalCoins || 0,
                    purchasedItems: parsed.purchasedItems || ['classic'],
                    equippedSkin: parsed.equippedSkin || 'classic',
                    highScore: parsed.highScore || 0,
                    levelsUnlocked: parsed.levelsUnlocked || 0
                };
            }
        } catch (e) {
            // Ignore parse errors
        }

        return {
            totalCoins: 0,
            purchasedItems: ['classic'],
            equippedSkin: 'classic',
            highScore: 0,
            levelsUnlocked: 0
        };
    }

    save(data) {
        try {
            localStorage.setItem(this.key, JSON.stringify(data));
        } catch (e) {
            // Ignore storage errors
        }
    }

    reset() {
        localStorage.removeItem(this.key);
    }
}
