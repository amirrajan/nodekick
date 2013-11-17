var express = require('express');
var config = require('./config.js').config;
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
io.set('log level', 0);
var game = require('./lib/game.js');

app.set('view engine', 'ejs');
app.use('/bower_components', express.static('bower_components'));
app.use('/public', express.static('public'));
app.use(express.bodyParser());

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/jump', function(req, res) {
  game.jump(req.body.playerId);
  res.end();
});

server.listen(process.env.PORT || config.port);

var fps = game.fps;
var framesPerSecondInMilliseconds = 1000.0 / fps;
setInterval(function() {
  game.tick();
  io.sockets.emit('gamestate', {
    frame: game.frame(),
    players: game.players()
  });
}, framesPerSecondInMilliseconds);
