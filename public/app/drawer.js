(function() {
  var game = null;
  var sprites = null;
  var c, canvas, deathCanvas, deathContext = null;
  var stageHeight = 500;
  var dyingPlayers = { };

  function init() {
    game = app.game;
    sprites = app.assets.sprites;
    canvas = window.document.getElementById('stage');
    c = canvas.getContext('2d');
    deathCanvas = window.document.getElementById('deathCanvas');
    deathContext = deathCanvas.getContext('2d');
  }

  function draw() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayers();
  }

  function drawPlayers() {
    _.each(game.players(), function(player) {
      var sprite = spriteFor(player);
      if(player.state == "dying") {
        app.deathAnimation.animate(player, sprite.image, sprite.x, sprite.y);
      }
      else {
        c.drawImage(sprite.image, sprite.x, sprite.y);
      }
    });
  }

  function drawHitBox(player) {
    c.fillRect(player.x, player.y + stageHeight, 2, 2); 
    _.each(game.boxes()[player.direction][playerState(player)], function(box) {
      drawBox(player, box);
    });
  }

  function drawBox(player, box) {
    c.fillRect(
      (player.x + box.x),
      (player.y + box.y) + stageHeight,
      Math.abs(box.x2 - box.x),
      Math.abs(box.y2 - box.y));
  }

  function playerState(player) {
    if(player.state == "dying") return player.deathState;

    return player.state;
  }

  function playerLocation(player) {
    return {
      x: player.x - game.boxes().playerCenter,
      y: (player.y + stageHeight) - game.boxes().playerHeight
    };
  }

  function spriteFor(player) {
    var state = playerState(player);
    var loc = playerLocation(player);
    var image = sprites.dive[player.direction][state];

    return { image: image, x: loc.x, y: loc.y };
  }

  app.drawer = { };
  app.drawer.init = init;
  app.drawer.draw = draw;
})();
