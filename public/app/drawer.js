(function() {
  var game = null;
  var sprites = null;
  var c, canvas = null;
  var stageHeight = 500;
  var playerHeight = 150;
  var playerHalfWidth = 75.0/2.0;
  var boxes = {
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
        { x: -10, y: -160, x2: 10, y2: -130 },
        { x: -28.5, y: -135, x2: -3.5, y2: -122.5 },
        { x: -40, y: -120, x2: -5, y2: -100 },
        { x: -35, y: -100, x2: 30, y2: -87.5 },
        { x: -30, y: -90, x2: 20, y2: -77.5 },
        { x: -8.5, y: -75, x2: 6.5, y2: -45 },
        { x: 10, y: -50, x2: 20, y2: -32.5 },
        { x: 25, y: -35, x2: 47.5, y2: -12.5 }
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
        { x: -10, y: -160, x2: 10, y2: -130 },
        { x: 3.5, y: -135, x2: 28.5, y2: -122.5 },
        { x: 5, y: -120, x2: 40, y2: -100 },
        { x: -30, y: -100, x2: 35, y2: -87.5 },
        { x: -20, y: -90, x2: 30, y2: -77.5 },
        { x: -6.5, y: -75, x2: 8.5, y2: -45 },
        { x: -20, y: -50, x2: -10, y2: -32.5 },
        { x: -47.5, y: -35, x2: -25, y2: -12.5 }
      ]
    }
  };


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
      player.state = "jumping";
      var sprite = spriteFor(player);
      c.drawImage(sprite.image, sprite.x, sprite.y);
      drawHitBox(player);
    });
  }

  function drawHitBox(player) {
    c.fillRect(player.x, player.y + stageHeight, 2, 2); 
    _.each(boxes[player.direction][player.state], function(box) {
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
