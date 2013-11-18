(function() {
  var sprites = { };

  function init() {
    sprites.box = new Image();

    sprites.dive = {
      "1" : {
        standing: new Image(),
        jumping: new Image(),
        kicking: new Image()
      },
      "-1" : {
        standing: new Image(),
        jumping: new Image(),
        kicking: new Image()
      }
    };

    sprites.dive["1"].standing.src = "/public/images/dive-standing-sprite.png";
    sprites.dive["1"].jumping.src = "/public/images/dive-jumping-sprite.png";
    sprites.dive["1"].kicking.src = "/public/images/dive-kicking-sprite.png";
    sprites.dive["-1"].standing.src = "/public/images/dive-standing-sprite-inverted.png";
    sprites.dive["-1"].jumping.src = "/public/images/dive-jumping-sprite-inverted.png";
    sprites.dive["-1"].kicking.src = "/public/images/dive-kicking-sprite-inverted.png";
    sprites.box.src = "/public/images/block.png";
  };

  app.assets = { };
  app.assets.init = init;
  app.assets.sprites = sprites;
})();
