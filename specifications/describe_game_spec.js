var game = require('../lib/game.js');

describe('jumping', function() {
  beforeEach(function() { game.reset(); });

  it("adds player if he doesn't exist", function() {
    game.up("player1");
    expect(game.players().length).toBe(1);
  });

  it("addition of player is ignored if they are already there", function() {
    game.up("player1");
    game.up("player1");
    expect(game.players().length).toBe(1);
  });

  it("velocity is set", function() {
    game.addPlayer("player1");
    game.getPlayer("player1").state = "standing";
    game.up("player1");
    expect(game.getPlayer("player1").velocityY).toBe(game.jumpPower);
  });

  it("player's y position changes after jump", function() {
    game.up("player1");
    game.tick();
    expect(game.getPlayer("player1").y).toBeLessThan(0);
  });

  it("player's initial state is jumping", function() {
    game.up("player1");
    game.tick();
    expect(game.getPlayer("player1").state).toBe("jumping");
  });
});

describe('stage boundaries', function() {
  beforeEach(function() { game.reset(); });

  it("player is set to dying if the stage's left boundary is hit", function() {
    var player = game.addPlayer("player1");
    player.state = "kicking";
    player.direction = -1;
    player.y = -1000;
    player.x = 200;
    var ticksTillBorder = (player.x - game.stageBoundary.left) / game.kickDelta;
    
    for(var i = 0; i < ticksTillBorder; i++) {
      game.tick();
    }

    expect(player.state).toBe("dying");
  });

  it("player is removed after death count", function() {
    var player = game.addPlayer("player1");
    player.state = "kicking";
    player.direction = -1;
    player.y = -1000;
    player.x = 0;
    game.tick();

    var countdown = player.deathCountdown;
    for(var i = 0; i < countdown; i++) {
      game.tick();
    }

    expect(game.players().length).toBe(0);
  });

  it("player is set to dying if the stage's right boundary is hit", function() {
    var player = game.addPlayer("player1");
    player.state = "kicking";
    player.direction = 1;
    player.y = -1000;
    player.x = 1000;
    var ticksTillBorder = (game.stageBoundary.right - player.x) / game.kickDelta;
    
    for(var i = 0; i < ticksTillBorder; i++) {
      game.tick();
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

    var foot = attacker.foot(game.boxes());
    var bodyParts = victim.boxes(game.boxes());
    game.tick();
    expect(victim.state).toBe('dying');
    expect(attacker.state).toBe('kicking');
  });
});
