(function() {
  var sprites = { };

  function init() {
    sprites.box = new Image();
    sprites.box.src = "/public/images/block.png";
  };

  app.assets = { };
  app.assets.init = init;
  app.assets.sprites = sprites;
})();
