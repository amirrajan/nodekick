var clock = 0;

function jump() {
  console.log("jumping like a boss");
}

function tick() {
  clock += 1;
}

exports.jump = jump;
exports.tick = tick;
exports.clock = function() { return clock; };
