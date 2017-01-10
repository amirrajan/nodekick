import _ from "underscore";
import world from "../common/world.js";
import {Player} from "./player.js";

class Game {
  constructor(gameId) {
    this.id = gameId;
    this.players = [ ];
    this.sockets = [ ];
  }

  getPlayer(playerId) {
    return _.findWhere(this.players, { id: playerId });
  }

  centerStage() {
    return world.stageBoundary.center;
  }

  ground() {
    return 0;
  }

  placePlayer(args) {
    const player = this.addPlayer(args.id, args.name);
    player.state = args.state;
    player.falling = false;
    if(args.footOverlaps) {
        player.x = args.footOverlaps.x;
        player.y = args.footOverlaps.y;
        player.x -= world.boxes[args.direction].kicking[7].x;
        player.y -= world.boxes[args.direction].kicking[7].y;
    } else {
      player.x = args.x;
      player.y = args.y;
    }
    player.direction = args.direction;
    return player;
  }

  addPlayer(playerId, playerName) {
    if(this.getPlayer(playerId)) return;
    const player = new Player(playerId);
    player.name = playerName;
    this.players.push(player);
    return player;
  }

  dyingPlayers() {
    return _.where(this.players, { state: "dying" });
  }

  alivePlayers() {
    return _.without(this.players, this.dyingPlayers());
  }
}

export {Game};
