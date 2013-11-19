(function() {
  function init() {
    app.game.init();
    app.gamePad.init({
      up: app.game.up,
      left: app.game.left,
      right: app.game.right
    });

    app.assets.init();
    app.drawer.init();
    drawLoop();
  }

  function drawLoop() {
    window.requestAnimationFrame(drawLoop);
    app.drawer.draw();
  }

  $(init);
})();

