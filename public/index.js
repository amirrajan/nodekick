(function() {
  function init() {
    app.gamePad.init();
    app.gamePad.up = app.game.jump;
    app.gamePad.left = app.game.attackLeft;
    app.gamePad.right = app.game.attackRight;
  }

  $(init);
})();

