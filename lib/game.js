var _ = require("underscore");
var frame = 0;
var players = [];
var jumpPower = 25;
var gravity = 1;
var fps = 60.0;

function Player(playerId) {
  this.id = playerId;
  this.x = _.random(100, 1200);
  this.y = 0;
  this.velocity = 0;
  this.state = "standing";
  this.isJumping = function() { return this.state == "jumping" };
  this.jump = function(velocity) {
    this.state = "jumping";
    this.velocity = velocity;
  };
}

function getPlayer(playerId) {
  return _.findWhere(players, { id: playerId });
}

function addPlayer(playerId) {
  if(getPlayer(playerId)) return;
  players.push(new Player(playerId));
}

function reset() { players = [ ]; }

function jump(playerId) {
  addPlayer(playerId);
  getPlayer(playerId).jump(jumpPower);
}

function applyGravity(player) {
  if(player.isJumping()) {
    player.y -= player.velocity;
    player.velocity -= gravity;
  }

  if(player.y > 0) {
    player.y = 0;
    player.state = "standing";
  }
}

function tick() {
  frame += 1;
  _.each(players, function(player) {
    applyGravity(player);
  });
}

exports.fps = fps;
exports.jump = jump;
exports.tick = tick;
exports.reset = reset;
exports.getPlayer = getPlayer;
exports.jumpPower = jumpPower;
exports.players = function() { return players; };
exports.frame = function() { return frame; };
