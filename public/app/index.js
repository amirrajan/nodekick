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
    setInterval(function() {
      if(!app.ai) return;
      if(!app.ai.tick) return;

      var you = _.findWhere(app.game.players(), { id: app.game.playerId() });
      var them = _.without(app.game.players(), you);
      var action = app.ai.tick(you, them);

      if(!action) return;

      if(!you) you = { state: "standing" };

      if(action == "up" && you.state == "standing") app.game.up();
          
      else if(action == "left") app.game.left();

      else if(action == "right") app.game.right();

    }, 100);
  }

  function drawLoop() {
    window.requestAnimationFrame(drawLoop);
    app.drawer.draw();
  }

  $(init);
})();

