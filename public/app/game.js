(function() {
  var clock = 0;
  var socket = null;
  var id = null;
  var gameState = { players: [] };

  function jump() {
    $.post("/jump", { playerId: id });
  }

  function attackLeft() {
    $.post("/left", { playerId: id });
  }

  function attackRight() {
    $.post("/right", { playerId: id });
  }

  function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
  }

  function sync() {

  }

  function init() {
    id = guid();
    socket = io.connect('/');
    socket.on('gamestate', function(state) {
      gameState = state;
    });
  }

  app.game = { };
  app.game.init = init;
  app.game.jump = jump;
  app.game.attackLeft = attackLeft;
  app.game.attackRight = attackRight;
  app.game.clock = function() { return clock; }
  app.game.players = function() { return gameState.players; }
  app.game.boxes = function() { return gameState.boxes; }
})();
