(function() {
  var game = null;
  var stageHeight = 500;
  var stage, renderer = null;
  var sprites = { };

  function init() {
    stage = new PIXI.Stage(0xFFFFFF);
    renderer = PIXI.autoDetectRenderer(1280, 500);
    
    $("#stage").append(renderer.view);
    game = app.game;
  }

  function startDrawing() {
    requestAnimFrame(draw);
  }

  function addPlayerSprite(player) {
    if(sprites[player.id]) return;

    var playerSprite = new app.PlayerSprite(player.id);
    sprites[player.id] = playerSprite;
    stage.addChild(playerSprite.sprite);
  }

  function draw() {
    requestAnimFrame(draw);
  
    _.each(game.players(), addPlayerSprite);
    _.each(sprites, function(sprite) { sprite.draw(); });
    app.deathAnimations.draw();

    renderer.render(stage);
  }

  app.drawer = { };
  app.drawer.init = init;
  app.drawer.stage = function() { return stage; };
  app.drawer.startDrawing = startDrawing;
})();
