var game = require('../lib/game.js');

describe('jumping', function() {
  beforeEach(function() {
    game.reset();
  });

  it("adds player if he doesn't exist", function() {
    game.jump("player1");
    expect(game.players().length).toBe(1);
  });

  it("addition of player is ignored if they are already there", function() {
    game.jump("player1");
    game.jump("player1");
    expect(game.players().length).toBe(1);
  });

  it("velocity is set", function() {
    game.jump("player1");
    expect(game.getPlayer("player1").velocity).toBe(game.jumpPower);
  });

  it("player's y position changes after jump", function() {
    game.jump("player1");
    game.tick();
    expect(game.getPlayer("player1").y).toBeLessThan(0);
  });
});
