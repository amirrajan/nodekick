(function() {
  var sprites = { };

  function init() {
    sprites.dive = {
      "1" : { standing: null, jumping: null, kicking: null },
      "-1" : { standing: null, jumping: null, kicking: null }
    };

    sprites.dive["1"].standing = PIXI.Texture.fromImage("/public/images/dive-standing-sprite.png");
    sprites.dive["1"].jumping = PIXI.Texture.fromImage("/public/images/dive-jumping-sprite.png");
    sprites.dive["1"].kicking = PIXI.Texture.fromImage("/public/images/dive-kicking-sprite.png");
    sprites.dive["-1"].standing = PIXI.Texture.fromImage("/public/images/dive-standing-sprite-inverted.png");
    sprites.dive["-1"].jumping = PIXI.Texture.fromImage("/public/images/dive-jumping-sprite-inverted.png");
    sprites.dive["-1"].kicking = PIXI.Texture.fromImage("/public/images/dive-kicking-sprite-inverted.png");
  };

  app.assets = { };
  app.assets.init = init;
  app.assets.sprites = sprites;
})();
