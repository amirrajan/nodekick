var _ = require("underscore");

function Player(playerId) {
  this.id = playerId;
  this.x = _.random(100, 1200);
  this.y = -700;
  this.velocity = 0;
  this.direction = 1;
  this.state = "jumping";
  this.isJumping = function() { return this.state == "jumping" };
  this.jump = function(velocity) {
    if(this.isJumping()) return;
    this.state = "jumping";
    this.velocity = velocity;
  };
  this.left = function() {
    this.direction = -1;
  };
  this.right = function() {
    this.direction = 1;
  };
}

exports.Player = Player;
