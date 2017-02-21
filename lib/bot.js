import _ from 'underscore';
import {Player} from './player.js';
import {EasyBot} from "./easyBot.js";

function add(game) {
  const numberOfBotsToAdd = 5;
  if(game.players.length == 0) return false;
  if(game.players.length == bots(game).length) return false;
  if((game.players.length - bots(game).length) >= numberOfBotsToAdd) return false;
  if(bots(game).length >= numberOfBotsToAdd) return false;

  let changeOccurred = false;

  _.times(numberOfBotsToAdd, (i) => {
    let name = "bot" + i.toString();
    if(!game.getPlayer(name)) {
      let player = game.addPlayer(name);
      player.name = "bot";
      player.bot = true;
      player.ai = new EasyBot(player, game);

      changeOccurred = true;
    }
  });

  return changeOccurred;
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
