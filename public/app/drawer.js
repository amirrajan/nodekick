(function() {
  var game = null;
  var sprites = null;
  var c, canvas = null;
  var stageHeight = 450;

  function init() {
    game = app.game;
    sprites = app.assets.sprites;
    canvas = window.document.getElementById('stage');
    c = canvas.getContext('2d');
  }

  function draw() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayers();
  }

  function drawPlayers() {
    _.each(game.players(), function(player) {
      c.drawImage(sprites.dive[player.direction][player.state], player.x, player.y + stageHeight);
    });
  }

  app.drawer = { };
  app.drawer.init = init;
  app.drawer.draw = draw;
})();
