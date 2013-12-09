var _ = require("underscore");
var world = require("../common/world.js");
var Player = require("./player.js").Player;

function Game(gameId) {
  this.id = gameId;
  this.players = [ ];
  this.sockets = [ ];

  this.getPlayer = function (playerId) {
    return _.findWhere(this.players, { id: playerId });
  };

  this.centerStage = function() {
    return world.stageBoundary.center;
  };

  this.ground = function() {
    return 0;
  };

  this.placePlayer = function(args) {
    var player = this.addPlayer(args.id, args.name);
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
  };

  this.addPlayer = function(playerId, playerName) {
    if(this.getPlayer(playerId)) return;
    var player = new Player(playerId);
    player.name = playerName;
    this.players.push(player);
    return player;
  };

  this.dyingPlayers = function() {
    return _.where(this.players, { state: "dying" });
  };

  this.alivePlayers = function() {
    return _.without(this.players, this.dyingPlayers());
  };
}

exports.Game = Game;
