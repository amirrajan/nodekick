(function() {
  var game = null;
  var stageHeight = 500;
  var stage, renderer = null;
  var sprites = { };
  var maxWidth = 1280;
  var maxHeight = 500;

  function init() {
    stage = new PIXI.Stage(0xFFFFFF);
    renderer = PIXI.autoDetectRenderer(1280, 500);
    $(window).resize(onResize);

    $("#stage").append(renderer.view);
    var background = PIXI.Texture.fromImage("/public/images/background.png");
    var sprite = new PIXI.Sprite(background);
    sprite.position.x = 0;
    sprite.position.y = -100;
    stage.addChild(sprite);
    setInterval(function() {
      console.log("sprite count", stage.children.length);
    }, 10000);

    game = app.game;
  }

  function onResize() {
    var width = $("#stage").width();
    var height = (width * maxHeight) / maxWidth;

    if(width < maxWidth) {
      $("canvas").css({ width: width, height: height });
    } else {
      $("canvas").css({ width: maxWidth, height: maxHeight });
    }
  }

  function startDrawing() {
    onResize();
    requestAnimFrame(draw);
    setInterval(calc, 17);
  }

  function calc() {
    app.playerSprites.tick(game.players());
    app.deathAnimations.tick();
  }

  function draw() {
    renderer.render(stage);
    requestAnimFrame(draw);
  }

  app.drawer = { };
  app.drawer.init = init;
  app.drawer.stageHeight = stageHeight;
  app.drawer.stage = function() { return stage; };
  app.drawer.startDrawing = startDrawing;
})();
