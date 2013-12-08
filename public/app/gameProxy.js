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

  function sendChat(message) {
    socket.emit("sendchat", { session: session(), message: message });
  }

  function getPlayer(playerId) {
    return _.findWhere(gameState.players, { id: playerId });
  }

  function me() {
    return getPlayer(playerId);
  }

  function init() {
    app.achievements.resetKillStreak();
    playerId = guid();
    socket = io.connect('/');
    playerName = $.cookie("name") || "anonymous";
    socket.on('connect', function() {
      socket.emit('joinGame', session());
    });

    socket.on('gamestate', function(state) {
      console.log("gamestate");
      gameState = state;
      if(me() && me().state == "dying") { 
        app.achievements.resetKillStreak();
      }
      applyGravity();
    });

    socket.on('receivechat', function(args) {
      console.log("receivechat");
      app.game.chatReceived(args.name, args.message);
    });

    socket.on('achievement', function(args) {
      console.log("achievement");
      app.game.achievementsReceived(args);
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
  app.game.sendChat = sendChat;
  app.game.getPlayer = getPlayer;
  app.game.clock = function() { return clock; };
  app.game.players = function() { return gameState.players; };
  app.game.boxes = function() { return gameState.boxes; };
})();
