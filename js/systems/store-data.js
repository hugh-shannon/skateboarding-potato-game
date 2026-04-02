const STORE_ITEMS = {
    skins: [
        { id: 'classic', name: 'Classic Spud', price: 0, description: 'The OG potato. Brown and proud.', owned: true },
        { id: 'hot_potato', name: 'Hot Potato', price: 500, description: 'Too hot to handle! Red with flames.' },
        { id: 'cool_spud', name: 'Cool Spud', price: 500, description: 'Chill vibes. Blue with shades.' },
        { id: 'golden', name: 'Golden Potato', price: 1000, description: 'Pure gold, baby. Bling bling!' },
        { id: 'neon_tater', name: 'Neon Tater', price: 1500, description: 'Glows in the dark. Totally tubular!' },
        { id: 'baked', name: 'Baked Potato', price: 2000, description: 'Wrapped in foil. Fully loaded.' },
        { id: 'french_fry', name: 'French Fry', price: 3000, description: 'A bundle of fries. Crispy!' },
        { id: 'galaxy', name: 'Galaxy Spud', price: 5000, description: 'Far out! A cosmic potato.' }
    ],
    upgrades: [
        { id: 'thick_skin_1', name: 'Thick Skin I', price: 300, description: '+1 starting life', requires: null },
        { id: 'thick_skin_2', name: 'Thick Skin II', price: 800, description: '+2 starting lives', requires: 'thick_skin_1' },
        { id: 'coin_magnet', name: 'Coin Magnet', price: 600, description: 'Coins attracted from further away' },
        { id: 'score_boost', name: 'Score Boost', price: 1000, description: 'All trick scores +25%' },
        { id: 'slow_start', name: 'Slow Start', price: 400, description: 'Start each level slower' },
        { id: 'lucky_spud', name: 'Lucky Spud', price: 1500, description: '10% obstacles become coins' },
        { id: 'combo_king', name: 'Combo King', price: 2000, description: 'Combo timer +50% longer' },
        { id: 'air_time', name: 'Air Time', price: 700, description: '15% higher jumps' }
    ]
};
