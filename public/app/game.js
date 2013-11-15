(function() {
  var game = { };

  game.jump = function() {
    $.post("/jump");
  };

  game.attackLeft = function() {
    $.post("/left");
  };

  game.attackRight = function() {
    $.post("/right");
  };

  app.game = game;
})();
