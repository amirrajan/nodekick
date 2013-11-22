(function() {
  var clock = 0;
  var socket = null;
  var playerId = null;
  var gameState = { players: [] };
  var kickDelta = 10;
  var gravity = 1;

  function up() {
    $.post("/up", { playerId: playerId });
  }

  function left() {
    $.post("/left", { playerId: playerId });
  }

  function right() {
    $.post("/right", { playerId: playerId });
  }

  function down() {
    $.post("/down", { playerId: playerId });
  }

  function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  function getPlayer(playerId) {
    return _.findWhere(gameState.players, { id: playerId });
  }

  function init() {
    playerId = guid();
    socket = io.connect('/');
    socket.on('gamestate', function(state) {
      gameState = state;
      applyGravity();
    });

    setInterval(applyGravity, 1000.0 / 60.0);
  }

  function applyGravity() {
    _.each(app.game.players(), function(player) {
      if(player.state == "dying") return;
      if(player.state == "jumping") {
        player.x -= player.velocityX;
        player.y -= player.velocityY;
        player.velocityY -= gravity;
      }

      if(player.state == "kicking") {
        player.y += kickDelta;
        player.x += (kickDelta) * player.direction;
      }

      if(player.y > 0) {
        player.y = 0;
        player.state = "standing";
      }
    });
  }

  app.game = { };
  app.game.playerId = function() { return playerId; };
  app.game.init = init;
  app.game.up = up;
  app.game.down = down;
  app.game.left = left;
  app.game.right = right;
  app.game.getPlayer = getPlayer;
  app.game.clock = function() { return clock; };
  app.game.players = function() { return gameState.players; };
  app.game.boxes = function() { return gameState.boxes; };
})();
