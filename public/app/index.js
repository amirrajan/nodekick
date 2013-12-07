(function() {
  function init() {
    app.game.init();
    app.achievements.init();

    app.gamePad.init({
      up: app.game.up,
      left: app.game.left,
      right: app.game.right,
      down: app.game.down
    });

    app.assets.init();
    app.drawer.init();
    app.deathAnimations.init();
    app.playerSprites.init();
    app.ai.init();
    app.chat.init();
    app.drawer.startDrawing();
  }

  $(init);
})();

