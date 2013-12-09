var _ = require("underscore");
var killStreaks = { };

function appendKillStreak(playerId, killResult) {
  if(!killStreaks[playerId]) {
    killStreaks[playerId] = {
      count: 0,
      result: killResult
    };
  }

  killStreaks[playerId].count += 1;
}

function resetKillStreak(playerId) {
  delete killStreaks[playerId];
}

function get(deaths) {
  var achievements = [ ];
  var killersThisTick = [ ];
  var killedThisTick = { };

  for(var key in deaths) {
    killedThisTick[key];
  }

  for(var key in deaths) {
    var death = deaths[key];

    appendKillStreak(death.killer.id, death);
    killersThisTick.push(death.killer.id);

    if(killersThisTick[death.killer.id]) return;

    if(death.killer.falling) {
      achievements.push({ type: "deathfromabove", details: death });
    }

    if(death.killed.falling &&
       death.killed.deathState == "kicking" &&
       !death.suicide) {
      achievements.push({ type: "counter", details: death });
    }

    if(death.headShot) {
      achievements.push({ type: "headshot", details: death });
    }
  }

  for(var key in deaths) {
    var death = deaths[key];

    if(death.suicide && !death.killed.falling) {
      achievements.push({ type: "suicide", details: death });
    }

    resetKillStreak(death.killed.id);
  }

  _.each(killersThisTick, function(id) {
    if(killStreaks[id] && killStreaks[id].count > 1) {
      achievements.push({
        type: "killstreak-" + killStreaks[id].count,
        details: killStreaks[id].result
      });
    }
  });

  return achievements;
}
    
exports.get = get;
