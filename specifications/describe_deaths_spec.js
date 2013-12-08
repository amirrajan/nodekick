var engine = require('../lib/engine.js');
var Game = require('../lib/game.js').Game;
var game = new Game();
var _ = require("underscore");

describe('player kills another', function() {
  beforeEach(function() { engine.reset(game); });

  it('registers a death on tick', function() {
    var standingPlayer = game.placePlayer({
      id: _.uniqueId(),
      name: "standing player",
      x: game.centerStage(),
      y: game.ground(),
      state: "standing"
    });

    var attackingPlayer = game.placePlayer({
      id: _.uniqueId(),
      name: "standing player",
      state: "kicking",
      position: { footOverlaps: standingPlayer.head() }
    });
  });
});
