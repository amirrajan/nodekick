var _ = require("underscore");
var Player = require("./player.js").Player;

function Game(gameId) {
  this.id = gameId;
  this.players = [ ];
  this.sockets = [ ];

  this.getPlayer = function (playerId) {
    return _.findWhere(this.players, { id: playerId });
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
