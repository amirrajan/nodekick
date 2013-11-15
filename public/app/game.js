(function() {
  var clock = 0;
  var socket = null;

  function jump() {
    $.post("/jump");
  }

  function attackLeft() {
    $.post("/left");
  }

  function attackRight() {
    $.post("/right");
  }

  function sync() {

  }

  function init() {
    socket = io.connect('/');
    socket.on('gamestate', function(gameState) {
      console.log(gameState);
    });
  }

  app.game = { };
  app.game.init = init;
  app.game.jump = jump;
  app.game.attackLeft = attackLeft;
  app.game.attackRight = attackRight;
  app.game.clock = function() { return clock; }
})();
