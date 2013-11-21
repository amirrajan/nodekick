(function() {
  var stageHeight = 500;
  var maxDeathCountdown = 40.0;

  function playerTexture(player) {
    return app.assets.sprites.dive[player.direction][playerState(player)];
  }

  function playerState(player) {
    if(player.state == "dying") return player.deathState;

    return player.state;
  }

  function PlayerSprite(playerId) {
    this.id = playerId;
    this.sprite = new PIXI.Sprite(playerTexture(app.game.getPlayer(this.id)));
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 1;
    this.deathCountdown = null;
    this.fadeOut = function() {
      if(this.deathCountdown == 0) return;
      if(this.deathCountdown == null) this.deathCountdown = maxDeathCountdown;
      this.sprite.alpha = this.deathCountdown / maxDeathCountdown;
      if(this.deathCountdown > 0) this.deathCountdown -= 1; 
    };
    this.draw = function() {
      var player = app.game.getPlayer(this.id);

      if(!player) {
        this.fadeOut();
        return;
      }

      this.sprite.setTexture(playerTexture(player));
      this.sprite.position.x = player.x;
      this.sprite.position.y = player.y + stageHeight;

      if(player.state == "dying") this.fadeOut();

      else {
        this.deathCountdown = null;
        this.sprite.alpha = 1;
      }
    };
  }

  app.PlayerSprite = PlayerSprite; 
})();
