(function() {
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

  var killStreak = 0;

  function resetKillStreak() {
    killStreak = 0;
    updateProgressBar();
  }

  function updateProgressBar() {
    $("#streakProgress").css({
      width: ((killStreak/15) * 100).toString() + "%"
    });
  }

  function incrementKillStreak() {
    killStreak += 3;
    updateProgressBar();
  }

  function init() {
    app.game.achievementsReceived = achievementsReceived;
  }

  function playerId() {
    return app.game.playerId();
  }

  function achievementsReceived(achievements) {
    _.each(achievements, function(achievement) {
      if(!notifications[achievement.type]) return;

      if(achievement.details.killer.id == playerId()) {
        app.notification.queue(notifications[achievement.type].me);
        if(achievement.type.match(/killstreak/)) {
          incrementKillStreak();
        }
      } else if(achievement.details.killed.id == playerId()) {
        app.notification.queue(notifications[achievement.type].them);
      }
    });
  }

  app.achievements = { };
  app.achievements.init = init;
  app.achievements.resetKillStreak = resetKillStreak;
})();
