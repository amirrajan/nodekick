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

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/jump', function(req, res) {
  game.jump();
  res.end();
});

server.listen(process.env.PORT || config.port);

var framesPerSecondInMilliseconds = 1000.0 / 1.0;
setInterval(function() {
  game.tick();
  io.sockets.emit('gamestate', { clock: game.clock() });
}, framesPerSecondInMilliseconds);
