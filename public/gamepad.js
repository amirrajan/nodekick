(function() {
  var gamePad = {
    keyState: { },
    methodMap: {
      "37": "left",
      "38": "up",
      "39": "right"
    },
    left: function() { },
    up: function() { },
    right: function() { }
  };

  gamePad.init = function() {
    for(var key in gamePad.methodMap) gamePad.keyState[key] = "up";

    $(document).keydown(function(e) {
      if(gamePad.keyState[e.keyCode] == "up") {
        gamePad.keyState[e.keyCode] = "down";
        var methodToCall = gamePad.methodMap[e.keyCode];
        if(methodToCall) gamePad[methodToCall]();
      }
    });

    $(document).keyup(function(e) {
      gamePad.keyState[e.keyCode] = "up";
    });
  };

  app.gamePad = gamePad;
})();
