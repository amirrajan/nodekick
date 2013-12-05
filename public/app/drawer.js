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
