import _ from "underscore";
const killStreaks = { };

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
  const achievements = [ ];
  const killersThisTick = [ ];
  const killedThisTick = { };

  for(const key in deaths) {
    killedThisTick[key];
  }

  for(const key in deaths) {
    const death = deaths[key];

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

  for(const key in deaths) {
    const death = deaths[key];

    if(death.suicide && !death.killed.falling) {
      achievements.push({ type: "suicide", details: death });
    }

    resetKillStreak(death.killed.id);
  }

  _.each(killersThisTick, id => {
    if(killStreaks[id] && killStreaks[id].count > 1) {
      achievements.push({
        type: `killstreak-${killStreaks[id].count}`,
        details: killStreaks[id].result
      });
    }
  });

  return achievements;
}

export {get};
