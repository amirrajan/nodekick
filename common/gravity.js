(function() {
  var jumpPower = 25;
  var backPedalY = 20;
  var backPedalX = 10;
  var kickDelta = 10;
  var downwardForce = 1;

  function tick(player) {
    if(player.state == "dying") return;

    if(player.state == "jumping") {
      player.y -= player.velocityY;
      player.x -= player.velocityX;
      player.velocityY -= downwardForce;
    }

    if(player.state == "kicking") {
      player.y += kickDelta;
      player.x += (kickDelta) * player.direction;
    }

    if(player.y > 0) {
      player.y = 0;
      player.state = "standing";
    }
  }

  if(typeof exports == "undefined") {
    app.gravity = { };
    exports = app.gravity;
  }

  exports.jumpPower = jumpPower;
  exports.backPedalY = backPedalY;
  exports.backPedalX = backPedalX;
  exports.kickDelta = 10;
  exports.tick = tick;
  exports.downwardForce = downwardForce;
})();
