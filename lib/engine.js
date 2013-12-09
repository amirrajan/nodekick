var _ = require("underscore");
var world = require("../common/world.js");
var Player = require("./player.js").Player;
var frame = 0;
var fps = 60.0;

function reset(game) { game.players = [ ]; }

function up(game, playerId, playerName) {
  game.addPlayer(playerId, playerName);
  game.getPlayer(playerId).up();
}

function left(game, playerId, playerName) {
  game.addPlayer(playerId, playerName);
  game.getPlayer(playerId).left();
}

function right(game, playerId, playerName) {
  game.addPlayer(playerId, playerName);
  game.getPlayer(playerId).right();
}

function down(game, playerId, playerName) {
  game.addPlayer(playerId, playerName);
  game.getPlayer(playerId).down();
}

function gravityTick(player) {
  if(player.isDying()) return;

  if(player.isJumping()) {
    player.y -= player.velocityY;
    player.x -= player.velocityX;
    player.velocityY -= world.downwardForce;
  }

  if(player.isKicking()) {
    player.y += world.kickDelta;
    player.x += (world.kickDelta) * player.direction;
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
  var deaths = { };

  _.each(game.players, function(player) {
    world.tick(player);

    var killResults = kills(player, livePlayers);
    
    _.each(killResults, function(killResult) {
      playersToKill.push(killResult.killed);
      deaths[killResult.killed.id] = killResult;
    });

    var suicide = applyBoundaryDeath(player);

    if(suicide) {
      deaths[player.id] = {
        killer: { },
        killed: player,
        suicide: true
      };
    }

    deathsOccurred = deathsOccurred || suicide;
  });

  _.each(playersToKill, killPlayer);

  removeDeadPlayers(game);
  
  if(playersToKill.length > 0) deathsOccurred = true;

  return {
    deathsOccurred: deathsOccurred,
    deaths: deaths,  
  };
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

    var foot = player.foot();
    var head = target.head();
    var bodyParts = target.boxes();
    var hitRegistered = false;

    _.each(bodyParts, function(bodyPart) {
      if(hasCollision(foot, bodyPart)) hitRegistered = true;
    });

    if(hitRegistered) killedTargets.push({
      killer: player,
      killed: target,
      headShot: hasCollision(foot, head)
    });
  });

  return killedTargets;
}

function applyBoundaryDeath(player) {
  if(player.state == "dying") return false;

  if(player.x <= world.stageBoundary.left) {
    killPlayer(player);
    return true;
  }

  if(player.x >= world.stageBoundary.right) {
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
  return true;
}

exports.fps = fps;
exports.stageBoundary = world.stageBoundary;
exports.up = up;
exports.down = down;
exports.left = left;
exports.right = right;
exports.tick = tick;
exports.reset = reset;
exports.jumpPower = world.jumpPower;
exports.kickDelta = world.kickDelta;
exports.players = function(game) { return game.players; };
exports.frame = function() { return frame; };
exports.hasCollision = hasCollision;
