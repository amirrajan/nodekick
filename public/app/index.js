(function() {
  function init() {
    app.gamePad.init({
      up: app.game.jump,
      left: app.game.attackLeft,
      right: app.game.attackRight
    });

    app.assets.init();
    app.drawer.init();
    app.game.init();
    drawLoop();
  }

  function drawLoop() {
    window.requestAnimationFrame(drawLoop);
    app.drawer.draw();
  }

  $(init);
})();

