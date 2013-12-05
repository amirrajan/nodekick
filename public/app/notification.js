(function() {
  var stageHeight = 500;
  var maxWidth = 1280;
  var messageQueue = [];

  function popMessage() {
    var message = messageQueue.pop();

    if(message) {
      var div = $("<div id='#notification'>" + message + "</div>");
      var width = $("#stage").width();
      var left = $("#stage").position().left;

      if(width > maxWidth) width = maxWidth;

      div.prependTo("body");
      div.css({
        left: width / 2 + left - 150,
        top: 20
      });

      div.addClass("message animated bounceIn");

      setTimeout(function() {
        div.removeClass("bounceIn");
        div.addClass("bounceOut");
        setTimeout(function() { div.remove(); }, 1000);
      }, 1000);
    }
  }
  
  function flash(message) {
    messageQueue.push(message);
  }

  function playSound(name) {

  }

  setInterval(popMessage, 1000);

  app.notification = { };
  app.notification.flash = flash;
})();

