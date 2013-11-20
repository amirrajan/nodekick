(function() {
  var keyState = { };
  var methodMap = {
    "37": "left",
    "38": "up",
    "39": "right",
    "40": "down"
  };

  function init(methods) {
    for(var key in methodMap) keyState[key] = "up";

    $(document).keydown(function(e) {
      if(keyState[e.keyCode] == "up") {
        keyState[e.keyCode] = "down";
        var methodToCall = methodMap[e.keyCode];
        if(methodToCall) methods[methodToCall]();
      }
    });

    $(document).keyup(function(e) {
      keyState[e.keyCode] = "up";
    });
  }

  app.gamePad = { };
  app.gamePad.init = init;
})();
