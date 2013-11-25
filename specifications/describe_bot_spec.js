var Game = require('../lib/game.js').Game;
var game = new Game();
var bot = require('../lib/bot.js');
var _ = require('underscore');

describe('adding a bot', function() {
  beforeEach(function() { game = new Game(); });
  it('adds two bot to a game with only one player (and he is standing)', function() {
    var player = game.addPlayer("player1");
    player.state = "standing";
    bot.add(game);
    expect(_.findWhere(game.players, { bot: true })).toNotBe(null);
    expect(_.findWhere(game.players, { bot: false })).toNotBe(null);
  });

  it("only adds bot if there is one player", function() {
    bot.add(game);
    expect(game.players.length).toBe(0);
  });

  it("only adds bot if there is one player and that player isn't a bot", function() {
    game.addPlayer("player1");
    game.players[0].bot = true;
    bot.add(game);
    expect(game.players.length).toBe(1);
  });
});
