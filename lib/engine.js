var _ = require("underscore");
var gravity = require("../common/gravity.js");
var Player = require("./player.js").Player;
var frame = 0;
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
        { x: 20, y: -28, x2: 35, y2: -10 } //foot
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
        { x: -35, y: -28, x2: -20, y2: -10 } //foot
      ]
    }
  };

function reset(game) { game.players = [ ]; }

function up(game, playerId) {
  game.addPlayer(playerId);
  game.getPlayer(playerId).up(gravity.jumpPower);
}

function left(game, playerId) {
  game.addPlayer(playerId);
  game.getPlayer(playerId).left();
}

function right(game, playerId) {
  game.addPlayer(playerId);
  game.getPlayer(playerId).right();
}

function down(game, playerId) {
  game.addPlayer(playerId);
  game.getPlayer(playerId).down(gravity.backPedalX, gravity.backPedalY);
}

function gravityTick(player) {
  if(player.isDying()) return;

  if(player.isJumping()) {
    player.y -= player.velocityY;
    player.x -= player.velocityX;
    player.velocityY -= gravity.downwardForce;
  }

  if(player.isKicking()) {
    player.y += gravity.kickDelta;
    player.x += (gravity.kickDelta) * player.direction;
  }

  if(player.y > 0) {
    player.y = 0;
    player.state = "standing";
  }
}

function tick(game) {
  frame += 1;
  var livePlayers = game.alivePlayers();
  var playersToKill = [];
  var deathsOccurred = false;
  _.each(game.players, function(player) {
    gravity.tick(player);

    var result = kills(player, livePlayers);

    _.each(result, function(killed) { playersToKill.push(killed); });
    
    deathsOccurred = deathsOccurred || applyBoundaryDeath(player);
  });

  _.each(playersToKill, killPlayer);

  removeDeadPlayers(game);
  
  if(playersToKill.length > 0) deathsOccurred = true;

  return deathsOccurred;
}

function removeDeadPlayers(game) {
  var playersToCountdown = game.dyingPlayers();

  _.each(playersToCountdown, function(player) {
    player.deathCountdown -= 1;
  });

  game.players = _.without(game.players, _.find(playersToCountdown, function(player) { return player.deathCountdown <= 0; }));
}

function kills(player, livePlayers) {
  if(!player.isKicking()) return;

  var killedTargets = [];

  _.each(livePlayers, function(target) {
    if(target == player) return;
    if(target.state == "dying") return;

    var foot = player.foot(boxes);
    var bodyParts = target.boxes(boxes);
    var hitRegistered = false;
    _.each(bodyParts, function(bodyPart) {
      if(hasCollision(foot, bodyPart)) hitRegistered = true;
    });

    if(hitRegistered) killedTargets.push(target);
  });

  return killedTargets;
}

function applyBoundaryDeath(player) {
  if(player.x <= stageBoundary.left) {
    killPlayer(player);
    return true;
  }

  if(player.x >= stageBoundary.right) {
    killPlayer(player);
    return true;
  }

  return false;
}

function killPlayer(player) {
  if(player.state == "dying") return;
  player.deathState = player.state;
  player.deathCountdown = fps;
  player.state = "dying";
}

function hasCollision(points1, points2) {
  if (points1.x2 < points2.x) return false;
  if (points1.x > points2.x2) return false;
  if (points1.y2 < points2.y) return false;
  if (points1.y > points2.y2) return false;
  return true
}

exports.fps = fps;
exports.stageBoundary = stageBoundary;
exports.up = up;
exports.down = down;
exports.left = left;
exports.right = right;
exports.tick = tick;
exports.reset = reset;
exports.jumpPower = gravity.jumpPower;
exports.kickDelta = gravity.kickDelta;
exports.boxes = function() { return boxes; };
exports.players = function(game) { return game.players; };
exports.frame = function() { return frame; };
exports.hasCollision = hasCollision;
