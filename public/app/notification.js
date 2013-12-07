(function() {
  app.notification = { };

  window.soundManager.setup({
    debugMode: false,
    useFlashBlock: false,
    useHighPerformance: true,
    flashVersion: 9,
    url: '/bower_components/soundmanager/swf/',
    onready: function() {
      app.notification.sounds = { };
      app.notification.sounds["deathfromabove-me"] = soundManager.createSound("deathfromabove-me", "/public/sounds/deathfromabove-me.mp3");
      app.notification.sounds["deathfromabove-them"] = soundManager.createSound("deathfromabove-them", "/public/sounds/deathfromabove-them.mp3");
      app.notification.sounds["suicide-them"] = soundManager.createSound("suicide-them", "/public/sounds/suicide-them.mp3");
      app.notification.sounds["counter-me"] = soundManager.createSound("counter-me", "/public/sounds/counter-me.mp3");
      app.notification.sounds["counter-them"] = soundManager.createSound("counter-them", "/public/sounds/counter-them.mp3");
      app.notification.sounds["headshot-me"] = soundManager.createSound("headshot-me", "/public/sounds/headshot-me.mp3");
      app.notification.sounds["headshot-them"] = soundManager.createSound("headshot-them", "/public/sounds/headshot-them.mp3");
      app.notification.sounds["killstreak-them"] = soundManager.createSound("killstreak-them", "/public/sounds/killstreak-them.mp3");
      app.notification.sounds["killstreak-3"] = soundManager.createSound("killstreak-3", "/public/sounds/killstreak-3.mp3");
      app.notification.sounds["killstreak-6"] = soundManager.createSound("killstreak-6", "/public/sounds/killstreak-6.mp3");
      app.notification.sounds["killstreak-9"] = soundManager.createSound("killstreak-9", "/public/sounds/killstreak-9.mp3");
      app.notification.sounds["killstreak-12"] = soundManager.createSound("killstreak-12", "/public/sounds/killstreak-12.mp3");
      app.notification.sounds["killstreak-15"] = soundManager.createSound("killstreak-15", "/public/sounds/killstreak-15.mp3");
    },
    defaultOptions: {
      volume: 50
    }
  });

  var stageHeight = 500;
  var maxWidth = 1280;
  var notificationQueue = [];

  function popMessage() {
    var notification = notificationQueue.pop();

    if(notification) {
      var div = $("<div id='#notification'>" + notification.message + "</div>");
      var width = $("#stage").width();
      var left = $("#stage").position().left;

      if(width > maxWidth) width = maxWidth;

      div.prependTo("body");
      div.css({
        left: width / 2 + left - 150,
        top: 20
      });

      div.addClass("message animated bounceIn");
      app.notification.sounds[notification.sound].play();

      setTimeout(function() {
        div.removeClass("bounceIn");
        div.addClass("bounceOut");
        setTimeout(function() { div.remove(); }, 1000);
      }, 1000);
    }
  }
  
  function queue(notification) {
    notificationQueue.push(notification);
  }

  function playSound(name) {

  }

  setInterval(popMessage, 1000);

  app.notification.queue = queue;
})();

