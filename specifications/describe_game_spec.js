var engine = require('../lib/engine.js');
var Game = require('../lib/game.js').Game;
var game = new Game();

describe('jumping', function() {
  beforeEach(function() { engine.reset(game); });

  it("adds player if he doesn't exist", function() {
    engine.up(game, "player1");
    expect(engine.players(game).length).toBe(1);
  });

  it("addition of player is ignored if they are already there", function() {
    engine.up(game, "player1");
    engine.up(game, "player1");
    expect(engine.players(game).length).toBe(1);
  });

  it("velocity is set", function() {
    game.addPlayer("player1");
    game.getPlayer("player1").state = "standing";
    engine.up(game, "player1");
    expect(game.getPlayer("player1").velocityY).toBe(engine.jumpPower);
  });

  it("player's y position changes after jump", function() {
    engine.up(game, "player1");
    engine.tick(game);
    expect(game.getPlayer("player1").y).toBeLessThan(0);
  });

  it("player's initial state is jumping", function() {
    engine.up(game, "player1");
    engine.tick(game);
    expect(game.getPlayer("player1").state).toBe("jumping");
  });
});

describe('stage boundaries', function() {
  beforeEach(function() { engine.reset(game); });

  it("player is set to dying if the stage's left boundary is hit", function() {
    var player = game.addPlayer("player1");
    player.state = "kicking";
    player.direction = -1;
    player.y = -1000;
    player.x = 200;
    var ticksTillBorder = (player.x - engine.stageBoundary.left) / engine.kickDelta;
    
    for(var i = 0; i < ticksTillBorder; i++) {
      engine.tick(game);
    }

    expect(player.state).toBe("dying");
  });

  it("player is removed after death count", function() {
    var player = game.addPlayer("player1");
    player.state = "kicking";
    player.direction = -1;
    player.y = -1000;
    player.x = 0;
    engine.tick(game);

    var countdown = player.deathCountdown;
    for(var i = 0; i < countdown; i++) {
      engine.tick(game);
    }

    expect(engine.players(game).length).toBe(0);
  });

  it("player is set to dying if the stage's right boundary is hit", function() {
    var player = game.addPlayer("player1");
    player.state = "kicking";
    player.direction = 1;
    player.y = -1000;
    player.x = 1000;
    var ticksTillBorder = (engine.stageBoundary.right - player.x) / engine.kickDelta;
    
    for(var i = 0; i < ticksTillBorder; i++) {
      engine.tick(game);
    }

    expect(player.state).toBe("dying");
  });
});

describe('hit boxes', function() {
  it('kills player', function() {
    var attacker = game.addPlayer("attacker");
    attacker.x = 500;
    attacker.y = -100;
    attacker.direction = -1;
    attacker.state = "kicking";

    var victim = game.addPlayer("victim");
    victim.x = 450;
    victim.y = 0;
    victim.direction = -1;
    victim.state = "standing";

    var foot = attacker.foot();
    var bodyParts = victim.boxes();
    engine.tick(game);
    expect(victim.state).toBe('dying');
    expect(attacker.state).toBe('kicking');
  });
});
