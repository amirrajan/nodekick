var _ = require('underscore');
var world = require("../common/world.js");
var stageBoundary = world.stageBoundary;

function standingRoutine(player, bot) {
  if(player.state != "standing") return false; 

  if(Math.random() < 0.40) {
    bot.sleep = 60;
    return false;
  }

  if(between(player.x, stageBoundary.center - 100, stageBoundary.center)) {
    player.left();
    player.down();
    bot.attackHeight = _.random(-150, -400);
    return true;
  }

  if(between(player.x, stageBoundary.center, stageBoundary.center + 100)) {
    player.right();
    player.down();
    bot.attackHeight = _.random(-200, -400);
    return true;
  }

  player.up();
  bot.attackHeight = _.random(-200, -400);
  return true;
}

function jumpingRoutine(player, bot) {
  if(player.state != "jumping") return false; 
  if(player.falling) return false;

  if(player.y < bot.attackHeight) {
    var direction = Math.random() > 0.5 ? "left" : "right";

    if(between(player.x, stageBoundary.left, stageBoundary.center - 200)) {
      direction = "right";
    }

    if(between(player.x, stageBoundary.center + 200, stageBoundary.right)) {
      direction = "left";
    }
    
    player[direction]();
    return true;
  }
  
  return false;
}

function tick(bot, player, game) {
  if(game.players.length == 1) return false;

  if(bot.sleep > 0) {
    bot.sleep -= 1;
    return false;
  }

  return standingRoutine(player, bot) || jumpingRoutine(player, bot);
}

function between(i, left, right) {
  return i >= left && i <= right;
}

function EasyBot(player, game) {
  this.bot = {
    sleep: 0,
    attackHeight: 0
  };

  this.tick = function() { return tick(this.bot, player, game); };
}

exports.EasyBot = EasyBot;
