(function() {
  var clock = 0;
  var socket = null;
  var playerId = null;
  var playerName = null;
  var gameState = { players: [] };
  var gameId = _.last(window.location.href.split('/'));
  var socket = null;

  function up() {
    socket.emit('up', session());
  }

  function left() {
    socket.emit('left', session());
  }

  function right() {
    socket.emit('right', session());
  }

  function down() {
    socket.emit('down', session());
  }

  function session() {
    return { playerId: playerId, gameId: gameId, playerName: playerName };
  }

  function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  function getPlayer(playerId) {
    return _.findWhere(gameState.players, { id: playerId });
  }

  function me() {
    return getPlayer(playerId);
  }

  function init() {
    playerId = guid();
    socket = io.connect('/');
    playerName = $.cookie("name") || "anonymous";
    socket.on('connect', function() {
      socket.emit('joinGame', session());
    });

    socket.on('gamestate', function(state) {
      gameState = state;
      applyGravity();
    });

    socket.on('notification', function(args) {
      var notifications = {
        "deathfromabove": {
          me: { message: "Bird of Prey", sound: "deathfromabove-me" },
          them: { message: "Death from Above", sound: "deathfromabove-them" }
        },
        "suicide": {
          me: { message: "", sound: "" },
          them: { message: "Idiot", sound: "suicide-them" }
        },
        "counter": {
          me: { message: "Counter", sound: "counter-me" },
          them: { message: "Denied", sound: "counter-them" }
        },
        "headshot": {
          me: { message: "Headshot", sound: "headshot-me" },
          them: { message: "Kicked in the Face", sound: "headshot-them" }
        },
        "killstreak-3": {
          me: { message: "Killing Streak", sound: "killstreak-3" },
          them: { message: "Lamb to the Slaughter", sound: "killstreak-them" }
        },
        "killstreak-6": {
          me: { message: "Rampage", sound: "killstreak-6" },
          them: { message: "Lamb to the Slaughter", sound: "killstreak-them" }
        },
        "killstreak-9": {
          me: { message: "Dominating", sound: "killstreak-9" },
          them: { message: "Lamb to the Slaughter", sound: "killstreak-them" }
        },
        "killstreak-12": {
          me: { message: "Unstoppable", sound: "killstreak-12" },
          them: { message: "Lamb to the Slaughter", sound: "killstreak-them" }
        },
        "killstreak-15": {
          me: { message: "Godlike", sound: "killstreak-15" },
          them: { message: "Lamb to the Slaughter", sound: "killstreak-them" }
        },
      };

      if(!notifications[args.type]) return;

      if(args.details.killer.id == playerId) {
        app.notification.queue(notifications[args.type].me);
      } else if(args.details.killed.id == playerId) {
        app.notification.queue(notifications[args.type].them);
      }
    });

    setInterval(applyGravity, 1000.0 / 60.0);
  }

  function applyGravity() {
    _.each(app.game.players(), app.gravity.tick);
  }

  app.game = { };
  app.game.playerId = function() { return playerId; };
  app.game.init = init;
  app.game.up = up;
  app.game.me = me;
  app.game.down = down;
  app.game.left = left;
  app.game.right = right;
  app.game.getPlayer = getPlayer;
  app.game.clock = function() { return clock; };
  app.game.players = function() { return gameState.players; };
  app.game.boxes = function() { return gameState.boxes; };
})();
