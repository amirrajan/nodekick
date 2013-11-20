(function() {
  var game = null;
  var stageHeight = 500;
  var stage, renderer = null;
  var sprites = { };

  function init() {
    stage = new PIXI.Stage(0xFFFFFF);
    renderer = PIXI.autoDetectRenderer(1280, 500);
    
    $("#stage").append(renderer.view);
    //document.body.appendChild(renderer.view);
    game = app.game;
    requestAnimFrame(draw);
  }

  function playerSprite(player) {
    var sprite = sprites[player.id];
    if(!sprite) {
      sprite = new PIXI.Sprite(playerTexture(player));
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 1;
      stage.addChild(sprite);
      sprites[player.id] = sprite;
    }

    return sprite;
  }

  function draw() {
    requestAnimFrame(draw);

    _.each(game.players(), function(player) {
      var sprite = playerSprite(player);

      sprite.setTexture(playerTexture(player));
      sprite.position.x = player.x;
      sprite.position.y = player.y + stageHeight;

      if(player.state == "dying") {
        sprite.alpha = player.deathCountdown / 60.0;
      } else {
        sprite.alpha = 1;
      }
    });

    renderer.render(stage);
  }
  
  function playerTexture(player) {
    return app.assets.sprites.dive[player.direction][playerState(player)];
  }

  function playerState(player) {
    if(player.state == "dying") return player.deathState;

    return player.state;
  }

  app.drawer = { };
  app.drawer.init = init;
})();
