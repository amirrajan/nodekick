(function() {
  var sprites = { };

  function init() {
    sprites.box = new Image();
    sprites.dive = {
      standing: new Image(),
      jumping: new Image()
    };
    sprites.dive.standing.src = "/public/images/dive-standing-sprite.png";
    sprites.dive.jumping.src = "/public/images/dive-jumping-sprite.png";
    sprites.box.src = "/public/images/block.png";
  };

  app.assets = { };
  app.assets.init = init;
  app.assets.sprites = sprites;
})();
