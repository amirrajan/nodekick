import _ from 'underscore';
import {Player} from './player.js';
import {EasyBot} from "./easyBot.js";

function add(game) {
  if(game.players.length == 0) return false;
  if(game.players.length == bots(game).length) return false;
  if((game.players.length - bots(game).length) >= 2) return false;
  if(bots(game).length >= 2) return false;

  //added with known id's so sprites on the
  //front end dont continue to increase
  if(!game.getPlayer("bot0")) {
    const player = game.addPlayer("bot0"); 
    player.name = "bot";
    player.bot = true;
    player.ai = new EasyBot(player, game);

    return true;
  }

  if(!game.getPlayer("bot1")) {
    const player = game.addPlayer("bot1"); 
    player.name = "bot";
    player.bot = true;
    player.ai = new EasyBot(player, game);

    return true;
  }


  return false;
}

function hasBots(game) {
  return bots(game).length > 0;
}

function bots({players}) {
  return _.where(players, { bot: true });
}

function tick(game) {
  let actionMade = false;

  _.each(bots(game), ({ai}) => {
    actionMade = actionMade || ai.tick();
  });

  return actionMade;
}

export {add, tick};
