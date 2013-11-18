var _ = require("underscore");
var Player = require("./player.js").Player;
var frame = 0;
var players = [];
var jumpPower = 25;
var kickDelta = 10;
var gravity = 1;
var fps = 60.0;

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

function left(playerId) {
  addPlayer(playerId);
  getPlayer(playerId).left();
}

function right(playerId) {
  addPlayer(playerId);
  getPlayer(playerId).right();
}

function applyGravity(player) {
  if(player.isJumping()) {
    player.y -= player.velocity;
    player.velocity -= gravity;
  }

  if(player.isKicking()) {
    player.y += kickDelta;
    player.x += (kickDelta) * player.direction;
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
exports.left = left;
exports.right = right;
exports.tick = tick;
exports.reset = reset;
exports.getPlayer = getPlayer;
exports.jumpPower = jumpPower;
exports.players = function() { return players; };
exports.frame = function() { return frame; };
