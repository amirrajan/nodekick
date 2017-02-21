(function() {
  function init() {
    app.game.init();
    app.achievements.init();

    app.gamePad.init({
      up: app.game.up,
      left: app.game.left,
      right: app.game.right,
      down: app.game.down
    });

    app.assets.init();
    app.drawer.init();
    app.deathAnimations.init();
    app.playerSprites.init();
    app.ai.init();
    app.chat.init();
    app.drawer.startDrawing();
    initPingStatistic();
    setInterval(emitPing, 500);
  }

  function emitPing() {
    if(!app.game) return;
    if(!app.game.socket) return;

    app.game.socket.emit('client-ping', { timestamp: new Date() });
  }

  function initPingStatistic() {
    if(!app.game) {
      setTimeout(initPingStatistic, 1000);
      return;
    }

    if(!app.game.socket) {
      setTimeout(initPingStatistic, 1000);
      return;
    }

    app.game.socket.on('client-pong', function(args) {
      var difference = (new Date() - new Date(args.timestamp)) + 'ms';
      $('#ping').html(difference);
    });
  }

  $(init);
})();
