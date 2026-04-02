const STORE_ITEMS = {
    skins: [
        { id: 'classic', name: 'Classic Spud', price: 0, description: 'A simple brown crayon potato.' },
        { id: 'crayon_spud', name: 'Crayon Spud', price: 500, description: 'Scribbled in rainbow crayon stripes!' },
        { id: 'stick_figure', name: 'Stick Figure Spud', price: 500, description: 'Drawn as a simple pencil sketch.' },
        { id: 'princess', name: 'Princess Spud', price: 1000, description: 'Pink with a crayon crown. Royal!' },
        { id: 'robot', name: 'Robot Spud', price: 1000, description: 'Boxy with an antenna. Beep boop!' },
        { id: 'superhero', name: 'Superhero Spud', price: 1500, description: 'Blue with a red crayon cape!' },
        { id: 'rainbow', name: 'Rainbow Spud', price: 2000, description: 'Changes color like magic crayons!' },
        { id: 'doodle', name: 'Doodle Spud', price: 5000, description: 'Covered in tiny stars and hearts!' }
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
