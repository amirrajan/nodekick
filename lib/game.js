var _ = require("underscore");
var Player = require("./player.js").Player;

function Game() {
  this.players = [ ];
  this.sockets = [ ];

  this.getPlayer = function (playerId) {
    return _.findWhere(this.players, { id: playerId });
  };

  this.addPlayer = function(playerId) {
    if(this.getPlayer(playerId)) return;
    var player = new Player(playerId);
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
