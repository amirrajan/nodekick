(function() {
  var stageHeight = 500;
  var stage;
  var sprites = { };

  function init() {
    stage = app.drawer.stage();
  }

  function playerTexture(playerId) {
    var player = app.game.getPlayer(playerId);
    return app.assets.sprites.dive[player.direction][playerState(player)];
  }

  function playerState(player) {
    if(player.state == "dying") return player.deathState;
    return player.state;
  }

  function add(player) {
    if(sprites[player.id]) return;

    var playerSprite = new PlayerSprite(player.id);
    sprites[player.id] = playerSprite;
    stage.addChild(playerSprite.sprite);
  }

  function draw(players) {
    _.each(players, app.playerSprites.add);
    _.each(sprites, function(sprite) { sprite.draw(); });
  }

  function PlayerSprite(playerId) {
    this.id = playerId;
    this.sprite = new PIXI.Sprite(playerTexture(this.id));
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 1;
    this.dead = false;
    this.draw = function() {
      var player = app.game.getPlayer(this.id);
      this.sprite.alpha = 0;

      if(!player) return;

      this.sprite.setTexture(playerTexture(this.id));
      this.sprite.position.x = player.x;
      this.sprite.position.y = player.y + stageHeight;

      if(player.state == "dying" && !this.dead) { 
        this.dead = true;
        app.deathAnimations.queue(
          playerTexture(this.id),
          this.sprite.position.x,
          this.sprite.position.y);
      } else if(player.state != "dying") {
        this.dead = false;
        this.sprite.alpha = 1;
      }
    };
  }

  app.playerSprites = { }
  app.playerSprites.init = init;
  app.playerSprites.draw = draw;
  app.playerSprites.add = add;
})();
