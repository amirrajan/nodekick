import _ from "underscore";
import world from "../common/world.js";
import {Player} from "./player.js";

const fps = 60.0;
let frame = 0;

function reset(game) { game.players = [ ]; }

function up(game, playerId, playerName) {
  game.addPlayer(playerId, playerName);
  game.getPlayer(playerId).up();
}

function left(game, playerId, playerName) {
  if(game.getPlayer(playerId))
    game.getPlayer(playerId).left();
}

function right(game, playerId, playerName) {
  if(game.getPlayer(playerId))
    game.getPlayer(playerId).right();
}

function down(game, playerId, playerName) {
  if(game.getPlayer(playerId))
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
  game.ticks += 1;
  frame += 1;
  const livePlayers = game.alivePlayers();
  const playersToKill = [];
  const deaths = { };
  let deathsOccurred = false;

  _.each(game.players, player => {
    world.tick(player);

    const killResults = kills(player, livePlayers);
    
    _.each(killResults, killResult => {
      playersToKill.push(killResult.killed);
      deaths[killResult.killed.id] = killResult;
    });

    const suicide = applyBoundaryDeath(player);

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
    deathsOccurred,
    deaths,  
  };
}

function removeDeadPlayers(game) {
  const playersToCountdown = game.dyingPlayers();

  _.each(playersToCountdown, player => {
    player.deathCountdown -= 1;
  });

  game.players = _.without(game.players, _.find(playersToCountdown, ({deathCountdown}) => deathCountdown <= 0));
}

function kills(player, livePlayers) {
  if(!player.isKicking()) return;

  const killedTargets = [];

  _.each(livePlayers, target => {
    if(target == player) return;
    if(target.state == "dying") return;

    const foot = player.foot();
    const head = target.head();
    const bodyParts = target.boxes();
    let hitRegistered = false;

    _.each(bodyParts, bodyPart => {
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

function getPlayers(game) {
  return game.players;
}

function getFrame() {
  return frame;
}

export {
  fps,
  up,
  down,
  left,
  right,
  tick,
  reset,
  getPlayers,
  getFrame,
  hasCollision
};

export const stageBoundary = world.stageBoundary;
export const jumpPower = world.jumpPower;
export const kickDelta = world.kickDelta;
