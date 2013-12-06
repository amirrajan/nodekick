(function() {
  var stageHeight = 500;
  var stage;
  var sprites = { };

  function init() {
    stage = app.drawer.stage();
  }

  function playerTexture(playerId) {
    var player = app.game.getPlayer(playerId);
    var rootSprite = app.assets.sprites.otherDive;

    if(playerId == app.game.playerId()) {
      rootSprite = app.assets.sprites.dive;
    }

    return rootSprite[player.direction][playerState(player)];
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
    stage.addChild(playerSprite.name);
  }

  function tick(players) {
    _.each(players, app.playerSprites.add);
    _.each(sprites, function(sprite) { sprite.tick(); });
  }

  function PlayerSprite(playerId) {
    this.id = playerId;
    this.sprite = new PIXI.Sprite(playerTexture(this.id));
    var base = {
      font: "10pt Arial",
      fill: "silver",
      stroke: "silver"
    };

    if(app.game.me() && app.game.me().id == this.id) {
      base = {
        font: "10pt Arial",
        strokeThickness: 1,
        fill: "silver",
        stroke: "silver"
      };
    }

    this.name = new PIXI.Text(app.game.getPlayer(this.id).name, base);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 1;
    this.name.anchor.x = 0.5;
    this.name.anchor.y = 1;
    this.dead = false;
    this.tick = function() {
      var player = app.game.getPlayer(this.id);
      this.sprite.alpha = 0;
      this.name.alpha = 0;

      if(!player) return;

      this.sprite.setTexture(playerTexture(this.id));
      this.sprite.position.x = player.x;
      this.sprite.position.y = player.y + stageHeight;
      this.name.position.x = player.x;
      this.name.position.y = player.y + stageHeight - 150;

      if(player.state == "dying" && !this.dead) { 
        this.dead = true;
        app.deathAnimations.queue(
          playerTexture(this.id),
          this.sprite.position.x,
          this.sprite.position.y);
      } else if(player.state != "dying") {
        this.dead = false;
        this.sprite.alpha = 1;
        this.name.alpha = 1;
      }
    };
  }

  app.playerSprites = { }
  app.playerSprites.init = init;
  app.playerSprites.tick = tick;
  app.playerSprites.add = add;
})();
