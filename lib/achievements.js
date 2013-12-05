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

function get(killResultsResults) {
  var achievements = [ ];
  var killersThisTick = [ ];
  var killedThisTick = { };

  _.each(killResultsResults, function(killResults) {
    _.each(killResults, function(killResult) {
      killedThisTick[killResult.killed.id];
    });
  });

  _.each(killResultsResults, function(killResults) {
    _.each(killResults, function(killResult) {
      appendKillStreak(killResult.killer.id, killResult);
      killersThisTick.push(killResult.killer.id);

      if(killersThisTick[killResult.killer.id]) return;

      if(killResult.killer.falling) {
        achievements.push({ type: "deathfromabove", details: killResult });
      }

      if(killResult.killed.falling &&
         killResult.killed.deathState == "kicking" &&
         !killResult.suicide) {
        achievements.push({ type: "counter", details: killResult });
      }

      if(killResult.headShot) {
        achievements.push({ type: "headshot", details: killResult });
      }
    });
  });

  _.each(killResultsResults, function(killResults) {
    _.each(killResults, function(killResult) {
      if(killResult.suicide && !killResult.killed.falling) {
        achievements.push({ type: "suicide", details: killResult });
      }

      resetKillStreak(killResult.killed.id);
    });
  });

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
