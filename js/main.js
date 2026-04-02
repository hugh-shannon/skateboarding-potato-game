window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);

    game.registerScene('menu', new MenuScene(game));
    game.registerScene('playing', new PlayingScene(game));
    game.registerScene('gameover', new GameOverScene(game));
    game.registerScene('store', new StoreScene(game));

    game.start();
});
