var engine = require('../lib/engine.js');
var Game = require('../lib/game.js').Game;
var achievements = require('../lib/achievements.js');
var game = new Game();
var _ = require("underscore");

describe('player headshots another', function() {
  beforeEach(function() { engine.reset(game); });

  it('registers a death on tick', function() {
    var standingPlayer = game.placePlayer({
      id: _.uniqueId(),
      name: "standing player",
      direction: -1,
      x: game.centerStage(),
      y: game.ground(),
      state: "standing"
    });

    var attackingPlayer = game.placePlayer({
      id: _.uniqueId(),
      name: "kicking player",
      state: "kicking",
      direction: 1,
      footOverlaps: standingPlayer.head()
    });

    var result = engine.tick(game);
    expect(result.deaths[standingPlayer.id].headShot).toBe(true);
    expect(achievements.get(result.deaths)[0].type).toBe("headshot");
  });
});
