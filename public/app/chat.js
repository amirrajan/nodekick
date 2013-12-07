(function() {
  function init() {
    $(document).keydown(function(e) {
      if(e.keyCode == 13) {
        if($("#chatMessage").val() == "") return;

        app.game.sendChat($("#chatMessage").val());
        $("#chatMessage").val('');
      }
    });

    app.game.chatReceived = function(from, message) {
      $("<div class='animated bounceIn'></div>").text(from + ": " + message).prependTo("#chatMessages");
    };
  }

  app.chat = { };
  app.chat.init = init;
})();

