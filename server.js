var _ = require('underscore');
var express = require('express');
var config = require('./config.js').config;
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var engine = require('./lib/engine.js');
var Game = require('./lib/game.js').Game;
var shouldBroadcast = true;
var games = { };

function setBroadcast(game) {
  game.shouldBroadcast = true;
}

function broadcast(game) {
  if(game.shouldBroadcast) {
    _.each(game.sockets, function(socket) {
      console.log("emitting game to", game.id, socket.id);
      socket.emit('gamestate', {
        frame: engine.frame(),
        players: engine.players(game),
        boxes: engine.boxes(),
      });
    });

    game.shouldBroadcast = false;
  }
}

function getGame(gameId) {
  if(!games[gameId]) {
    games[gameId] = new Game();
    games[gameId].id = gameId;
    games[gameId].shouldBroadcast = true;
  }
  console.log('getting game: ', gameId);

  return games[gameId];
}

io.set('log level', 0);
app.set('view engine', 'ejs');
app.use('/bower_components', express.static('bower_components'));
app.use('/public', express.static('public'));
app.use('/common', express.static('common'));
app.use(express.bodyParser());

app.get('/', function(req, res) {
  res.redirect('/game/public');
});

app.get('/ai', function(req, res) {
  res.render('index', { ai: true });
});

app.post('/up', function(req, res) {
  var game = getGame(req.body.gameId);
  engine.up(game, req.body.playerId);
  setBroadcast(game);
  res.end();
});

app.post('/left', function(req, res) {
  var game = getGame(req.body.gameId);
  engine.left(game, req.body.playerId);
  setBroadcast(game);
  res.end();
});

app.post('/right', function(req, res) {
  var game = getGame(req.body.gameId);
  engine.right(game, req.body.playerId);
  setBroadcast(game);
  res.end();
});

app.post('/down', function(req, res) {
  var game = getGame(req.body.gameId);
  engine.down(game, req.body.playerId);
  setBroadcast(game);
  res.end();
});

app.get("/game/:id", function(req, res) {
  getGame(req.params.id);

  res.render('index', { ai: false });
});

server.listen(process.env.PORT || config.port);

var fps = engine.fps;
var framesPerSecondInMilliseconds = 1000.0 / fps;

io.sockets.on('connection', function(socket) {
  socket.on('joinGame', function(data) {
    console.log(data);
    getGame(data.gameId).sockets.push(socket);
  });
});

setInterval(function() {
  for(var key in games) {
    var game = games[key];
    var deathsOccurred = engine.tick(game);
    if(deathsOccurred) { setBroadcast(game); }
    broadcast(game);
  }
}, framesPerSecondInMilliseconds);
