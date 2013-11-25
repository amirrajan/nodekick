(function() {
  var deathQueue = [ ];
  var maxDeathCountdown = 100;
  var stage;
  var gravity = 0.2;


  function init() {
    stage = app.drawer.stage();
  }

  function pieces(texture, x, y) {
    var results = [ ];
    var width = texture.frame.width;
    var height = texture.frame.height;
    var rows = 20;
    var columns = 10;
    var deltaX = width / columns;
    var deltaY = height / rows;
    _.times(rows, function(row) {
      _.times(columns, function(column) {
        var spriteX = column * deltaX;
        var spriteY = row * deltaY;
        var sprite = new PIXI.Sprite(new PIXI.Texture(texture, { x: spriteX, y: spriteY, width: deltaX, height: deltaY }));
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.position.x = x + (width * sprite.anchor.x) - (deltaX * (columns - (column + 1)));
        sprite.position.y = y - (deltaY * (rows - (row + 1)));
        results.push({
          sprite: sprite,
          dy: _.random(-20, 0),
          dx: _.random(-10, 10),
          scale: Math.random() * 0.05,
          scaleDirection: Math.random() > 0.5 ? -1 : 1,
          rotation: Math.random() / 2
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

  function tick() {
    _.each(deathQueue, function(death) {
      _.each(death.pieces, function(piece) {
        piece.sprite.alpha = death.deathCountdown / maxDeathCountdown;
        var dx = piece.dx;
        var dy = piece.dy;
        var scale = piece.scale * piece.scaleDirection;
        var rotation = piece.rotation;
        var tickCount = maxDeathCountdown - death.deathCountdown;

        if(tickCount > 5 && tickCount < 25) {
          dx = (dx / 10);
          dy = dy / 10;
          rotation = rotation / 10;
          scale = scale / 10;
        }

        piece.sprite.position.x += dx;
        piece.sprite.position.y += dy;
        piece.sprite.scale.x += scale;
        piece.sprite.scale.y += scale;
        piece.dy += gravity;
        piece.sprite.rotation += rotation;
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
  app.deathAnimations.tick = tick;
})();


