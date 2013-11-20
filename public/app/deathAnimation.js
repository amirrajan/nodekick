(function() {
  var c, canvas, deathCanvas, deathContext = null;
  var maxDeathCountdown = 60;
  var dyingPlayers = { };

  function init() {
    sprites = app.assets.sprites;
    canvas = window.document.getElementById('stage');
    c = canvas.getContext('2d');
    deathCanvas = window.document.getElementById('deathCanvas');
    deathContext = deathCanvas.getContext('2d');
  }

  function animate(player, sprite, canvasX, canvasY) {
    if(!dyingPlayers[player.id]) {
      dyingPlayers[player.id] = {
        id: player.id,
        deathCountdown: maxDeathCountdown,
        sprite: sprite,
        x: canvasX,
        y: canvasY
      };
    }
  }

  function draw() {
    for(var key in dyingPlayers) {
      var player = dyingPlayers[key];
      deathContext.clearRect(0, 0, 75, 150);
      deathContext.drawImage(player.sprite, 0, 0, 75, 150, 0, 0, 75, 150);
      player.deathCountdown -= 1;
      var alphaPercentage = player.deathCountdown / maxDeathCountdown;
      var stageSource = c.getImageData(player.x, player.y, 75, 150);
      var deathImage = deathContext.getImageData(0, 0, 75, 150);
      var length = deathImage.data.length;

      //make white and add fade out
      for(var i = 3; i < length; i += 4) {
        if(deathImage.data[i] > 0 && deathImage.data[i - 1] > 0 && deathImage.data[i - 2] > 0 && deathImage.data[i - 3] > 0) {
          deathImage.data[i-1] = deathImage.data[i-1] + 150;
          deathImage.data[i-2] = deathImage.data[i-2] + 150;
          deathImage.data[i-3] = deathImage.data[i-3] + 150;
          deathImage.data[i] *= alphaPercentage;
        }
      }

      //mix with image from the stage 
      deathContext.putImageData(stageSource, 0, 0);

      var mixedWithStage = deathContext.getImageData(0, 0, 75, 150);
      for(var i = 3; i < length; i += 4) {
        if(deathImage.data[i] > 0 && deathImage.data[i - 1] > 0 && deathImage.data[i - 2] > 0 && deathImage.data[i - 3] > 0) {
          mixedWithStage.data[i-1] = deathImage.data[i-1];
          mixedWithStage.data[i-2] = deathImage.data[i-2];
          mixedWithStage.data[i-3] = deathImage.data[i-3];
          mixedWithStage.data[i] = deathImage.data[i];
        }
      }

      c.putImageData(mixedWithStage, player.x, player.y);

      if(player.deathCountdown <= 0) {
        delete dyingPlayers[player.id];
      }
    }
  }

  app.deathAnimation = { };
  app.deathAnimation.init = init;
  app.deathAnimation.draw = draw;
  app.deathAnimation.animate = animate;
})();
