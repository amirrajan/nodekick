(function() {
  var deathQueue = [ ];
  var maxDeathCountdown = 40.0;
  var stage;

  function init() {
    stage = app.drawer.stage();
  }

  function queue(texture, x, y) {
    var sprite = new PIXI.Sprite(texture); 
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 1;
    sprite.position.x = x;
    sprite.position.y = y;

    var animation = {
      sprite: sprite,
      deathCountdown: maxDeathCountdown
    };

    deathQueue.push(animation); 
    stage.addChild(animation.sprite);
  }

  function draw() {
    _.each(deathQueue, function(death) {
      death.sprite.alpha = death.deathCountdown / maxDeathCountdown;
      death.deathCountdown -= 1;
    });

    deathQueue = _.without(deathQueue, _.where(deathQueue, { deathCountdown: 0 }));
  }

  app.deathAnimations = { };
  app.deathAnimations.init = init;
  app.deathAnimations.queue = queue;
  app.deathAnimations.draw = draw;
})();


