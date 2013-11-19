var _ = require("underscore");
var Player = require("./player.js").Player;
var frame = 0;
var players = [];
var jumpPower = 25;
var kickDelta = 10;
var gravity = 1;
var fps = 60.0;
var stageBoundary = { left: 0, right: 1280 };
var boxes = {
    playerHeight: 150,
    playerCenter: 75.0/2.0,
    "1": {
      standing: [
        { x: -10, y: -140, x2: 8, y2: -120 },
        { x: -30, y: -115, x2: 15, y2: -80 },
        { x: -20, y: -80, x2: 15, y2: -40 },
        { x: -25, y: -40, x2: 25, y2: -10 }
      ],
      jumping: [
        { x: -5, y: -135, x2: 15, y2: -115 },
        { x: -12, y: -115, x2: 12, y2: -65 },
        { x: -5, y: -70, x2: 7.5, y2: -12 },
        { x: 7.5, y: -70, x2: 25, y2: -50 },
        { x: -12, y: -50, x2: 12.5, y2: -30 }
      ],
      kicking: [
        { x: -8, y: -120, x2: 8, y2: -100 },
        { x: -20, y: -105, x2: 5, y2: -95 },
        { x: -35, y: -95, x2: 0, y2: -77 },
        { x: -25, y: -77, x2: 20, y2: -58 },
        { x: -10, y: -60, x2: 10, y2: -40 },
        { x: 0, y: -40, x2: 15, y2: -25 },
        { x: 7, y: -35, x2: 25, y2: -20 },
        { x: 20, y: -28, x2: 35, y2: -10 }
      ]
    },
    "-1": {
      standing: [
        { x: -8, y: -140, x2: 10, y2: -120 },
        { x: -15, y: -115, x2: 30, y2: -80 },
        { x: -15, y: -80, x2: 20, y2: -40 },
        { x: -25, y: -40, x2: 25, y2: -10 }
      ],
      jumping: [
        { x: -15, y: -135, x2: 5, y2: -115 },
        { x: -12, y: -115, x2: 12, y2: -65 },
        { x: -7.5, y: -70, x2: 5, y2: -12 },
        { x: -25, y: -70, x2: -7.5, y2: -50 },
        { x: -12.5, y: -50, x2: 12, y2: -30 }
      ],
      kicking: [
        { x: -8, y: -120, x2: 8, y2: -100 },
        { x: -5, y: -105, x2: 20, y2: -95 },
        { x: 0, y: -95, x2: 35, y2: -77 },
        { x: -20, y: -77, x2: -25, y2: -58 },
        { x: -10, y: -60, x2: 10, y2: -40 },
        { x: -15, y: -40, x2: 0, y2: -25 },
        { x: -25, y: -35, x2: -7, y2: -20 },
        { x: -35, y: -28, x2: -20, y2: -10 }
      ]
    }
  };

function getPlayer(playerId) {
  return _.findWhere(players, { id: playerId });
}

function addPlayer(playerId) {
  if(getPlayer(playerId)) return;
  var player = new Player(playerId);
  players.push(player);
  return player;
}

function reset() { players = [ ]; }

function up(playerId) {
  addPlayer(playerId);
  getPlayer(playerId).up(jumpPower);
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
    applyBoundaryDeath(player);
  });

  removeDeadPlayers();
}

function dyingPlayers() {
  return _.where(players, { state: "dying" });
}

function removeDeadPlayers() {
  var playersToCountdown = dyingPlayers();

  _.each(playersToCountdown, function(player) {
    player.deathCountdown -= 1;
  });

  players = _.without(players, _.findWhere(playersToCountdown, { deathCountdown: 0 }));
}

function applyBoundaryDeath(player) {
  if(player.x <= stageBoundary.left) killPlayer(player);

  if(player.x >= stageBoundary.right) killPlayer(player);
}

function killPlayer(player) {
  if(player.state == "dying") return;
  player.deathState = player.state;
  player.deathCountdown = fps;
  player.state = "dying";
}

exports.fps = fps;
exports.addPlayer = addPlayer;
exports.stageBoundary = stageBoundary;
exports.dyingPlayers = dyingPlayers;
exports.up = up;
exports.left = left;
exports.right = right;
exports.tick = tick;
exports.reset = reset;
exports.getPlayer = getPlayer;
exports.jumpPower = jumpPower;
exports.kickDelta = kickDelta;
exports.boxes = function() { return boxes; };
exports.players = function() { return players; };
exports.frame = function() { return frame; };
