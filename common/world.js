(function() {
  var jumpPower = 25;
  var backPedalY = 20;
  var backPedalX = 10;
  var kickDelta = 10;
  var downwardForce = 1;
  var stageBoundary = { left: 0, right: 1280 };
  var boxes = {
    playerHeight: 150,
    playerCenter: 75.0/2.0,
    "1": {
      standing: [
        { x: -10, y: -140, x2: 8, y2: -120 },
        { x: -30, y: -115, x2: 15, y2: -80 },
        { x: -20, y: -80, x2: 15, y2: -40 },
        { x: -25, y: -40, x2: 25, y2: -10 }
      ],
      jumping: [
        { x: -5, y: -135, x2: 15, y2: -115 },
        { x: -12, y: -115, x2: 12, y2: -65 },
        { x: -5, y: -70, x2: 7.5, y2: -12 },
        { x: 7.5, y: -70, x2: 25, y2: -50 },
        { x: -12, y: -50, x2: 12.5, y2: -30 }
      ],
      kicking: [
        { x: -8, y: -120, x2: 8, y2: -100 },
        { x: -20, y: -105, x2: 5, y2: -95 },
        { x: -35, y: -95, x2: 0, y2: -77 },
        { x: -25, y: -77, x2: 20, y2: -58 },
        { x: -10, y: -60, x2: 10, y2: -40 },
        { x: 0, y: -40, x2: 15, y2: -25 },
        { x: 7, y: -35, x2: 25, y2: -20 },
        { x: 20, y: -28, x2: 35, y2: -10 } //foot
      ]
    },
    "-1": {
      standing: [
        { x: -8, y: -140, x2: 10, y2: -120 },
        { x: -15, y: -115, x2: 30, y2: -80 },
        { x: -15, y: -80, x2: 20, y2: -40 },
        { x: -25, y: -40, x2: 25, y2: -10 }
      ],
      jumping: [
        { x: -15, y: -135, x2: 5, y2: -115 },
        { x: -12, y: -115, x2: 12, y2: -65 },
        { x: -7.5, y: -70, x2: 5, y2: -12 },
        { x: -25, y: -70, x2: -7.5, y2: -50 },
        { x: -12.5, y: -50, x2: 12, y2: -30 }
      ],
      kicking: [
        { x: -8, y: -120, x2: 8, y2: -100 },
        { x: -5, y: -105, x2: 20, y2: -95 },
        { x: 0, y: -95, x2: 35, y2: -77 },
        { x: -20, y: -77, x2: -25, y2: -58 },
        { x: -10, y: -60, x2: 10, y2: -40 },
        { x: -15, y: -40, x2: 0, y2: -25 },
        { x: -25, y: -35, x2: -7, y2: -20 },
        { x: -35, y: -28, x2: -20, y2: -10 } //foot
      ]
    }
  };

  stageBoundary.center = (stageBoundary.right + stageBoundary.left) / 2;

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
      player.falling = false;
    }
  }

  if(typeof exports == "undefined") {
    app.gravity = { };
    exports = app.gravity;
  }

  exports.boxes = boxes;
  exports.jumpPower = jumpPower;
  exports.backPedalY = backPedalY;
  exports.backPedalX = backPedalX;
  exports.kickDelta = 10;
  exports.tick = tick;
  exports.downwardForce = downwardForce;
  exports.stageBoundary = stageBoundary;
})();
