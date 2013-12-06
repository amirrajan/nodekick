(function() {
  function init() {
    app.game.init();
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
    app.drawer.startDrawing();
    app.game.chatReceived = function(from, message) {
      $("<div></div>").text(from + ": " + message).prependTo("#chatMessages");
    };

    $(document).keydown(function(e) {
      if(e.keyCode == 13) {
        if($("#chatMessage").val() == "") return;

        app.game.sendChat($("#chatMessage").val());
        $("#chatMessage").val('');
      }
    });
  }

  $(init);
})();

