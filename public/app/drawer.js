(function() {
  var game = null;
  var sprites = null;
  var c, canvas = null;
  var stageHeight = 500;
  var playerHeight = 150;
  var playerHalfWidth = 75.0/2.0;

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
      var sprite = spriteFor(player);
      c.drawImage(sprite.image, sprite.x, sprite.y);
      //c.fillRect(player.x, player.y + stageHeight, 10, 10); 
    });
  }

  function spriteFor(player) {
    return {
      image: sprites.dive[player.direction][player.state],
      x: player.x - playerHalfWidth,
      y: (player.y + stageHeight) - playerHeight
    };
  }

  app.drawer = { };
  app.drawer.init = init;
  app.drawer.draw = draw;
})();
