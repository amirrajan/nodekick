(function() {
  var deathQueue = [ ];
  var maxDeathCountdown = 60.0;
  var stage;
  var gravity = 1;


  function init() {
    stage = app.drawer.stage();
  }

  function pieces(texture, x, y) {
    var results = [ ];
    var width = texture.frame.width;
    var height = texture.frame.height;
    var rows = 20;
    var columns = 20;
    var deltaX = width / columns;
    var deltaY = height / rows;
    _.times(rows, function(row) {
      _.times(columns, function(column) {
        var spriteX = column * deltaX;
        var spriteY = row * deltaY;
        var sprite = new PIXI.Sprite(new PIXI.Texture(texture, { x: spriteX, y: spriteY, width: deltaX, height: deltaY }));
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 1;
        sprite.position.x = x + (width * sprite.anchor.x) - (deltaX * (columns - (column + 1)));
        sprite.position.y = y - (deltaY * (rows - (row + 1)));
        results.push({
          sprite: sprite,
          dy: _.random(-20, 0),
          dx: _.random(-20, 20),
          rotation: Math.random()
        });
      });
    });

    return results;
  }

  function queue(texture, x, y) {
    var bodyParts = pieces(texture, x, y);

    var animation = {
      pieces: bodyParts,
      deathCountdown: maxDeathCountdown
    };

    deathQueue.push(animation); 
    _.each(animation.pieces, function(piece) { stage.addChild(piece.sprite); });
  }

  function draw() {
    _.each(deathQueue, function(death) {
      _.each(death.pieces, function(piece) {
        piece.sprite.alpha = death.deathCountdown / maxDeathCountdown;
        piece.sprite.position.x += piece.dx;
        piece.sprite.position.y += piece.dy;
        piece.dy += gravity;
        piece.sprite.rotation += piece.rotation;
      });
      death.deathCountdown -= 1;
    });

    var done = _.where(deathQueue, { deathCountdown: 0 });

    _.each(done, function(d) {
      _.each(d.pieces, function(piece) {
        stage.removeChild(piece.sprite);
      });
    });

    deathQueue = _.without(deathQueue, done);
  }

  app.deathAnimations = { };
  app.deathAnimations.init = init;
  app.deathAnimations.queue = queue;
  app.deathAnimations.draw = draw;
})();


