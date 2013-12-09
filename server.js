var _ = require('underscore');
var express = require('express');
var config = require('./config.js').config;
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var engine = require('./lib/engine.js');
var Game = require('./lib/game.js').Game;
var bot = require('./lib/bot.js');
var achievements = require("./lib/achievements.js");
var shouldBroadcast = true;
var games = { };

io.set('log level', 0);
app.set('view engine', 'ejs');
app.use('/bower_components', express.static('bower_components'));
app.use('/public', express.static('public'));
app.use('/common', express.static('common'));
app.use(express.cookieParser());
app.use(express.session({ secret: "nodekick" }));
app.use(express.bodyParser());

//http
app.get('/', function(req, res) { res.render('index'); });

app.post('/join', function(req, res) {
  var room = req.body.room;
  if(!room) room = "public";
  res.redirect("/game/" + room);
});

app.get("/game/:id", function(req, res) {
  getGame(req.params.id);
  res.render('game');
});

server.listen(process.env.PORT || config.port);

//sockets
function setBroadcast(game) { game.shouldBroadcast = true; }

function broadcast(game) {
  if(!game.shouldBroadcast) return;

  emit(game.id, 'gamestate', {
    frame: engine.frame(),
    players: engine.players(game),
  });

  game.shouldBroadcast = false;
}

function emit(gameId, message, args) {
  var game = getGame(gameId);
  _.each(game.sockets, function(socket) {
    socket.emit(message, args);
  });
}

function getGame(gameId) {
  if(!games[gameId]) {
    games[gameId] = new Game(gameId);
    games[gameId].shouldBroadcast = true;
  }

  return games[gameId];
}

function input(direction, gameId, playerId, playerName) {
  var game = getGame(gameId);
  engine[direction](game, playerId, playerName);
  setBroadcast(game);
}

io.sockets.on('connection', function(socket) {
  socket.on('joinGame', function(data) {
    var game = getGame(data.gameId);
    socket.game = game;
    game.sockets.push(socket);
    setBroadcast(game);
  });

  socket.on('disconnect', function() {
    if(!socket.game) return;

    socket.game.sockets = _.without(socket.game.sockets, socket);
  });

  socket.on('up', function(data) {
    input('up', data.gameId, data.playerId, data.playerName);
  });

  socket.on('down', function(data) {
    input('down', data.gameId, data.playerId, data.playerName);
  });

  socket.on('left', function(data) {
    input('left', data.gameId, data.playerId, data.playerName);
  });

  socket.on('right', function(data) {
    input('right', data.gameId, data.playerId, data.playerName);
  });

  socket.on('sendchat', function(data) {
    emit(data.session.gameId, 'receivechat', {
      name: data.session.playerName,
      message: data.message
    });
  });
});

function processAchievements(game, tickResult) {
  var achievementsThisTick = achievements.get(tickResult.deaths);

  if(achievementsThisTick.length == 0) return;

  emit(game.id, 'achievement', achievementsThisTick);
}

var framesPerSecondInMilliseconds = 1000.0 / engine.fps;

setInterval(function() {
  for(var key in games) {
    var game = games[key];
    var botAdded = bot.add(game);
    var actionMade = bot.tick(game);
    var tickResult = engine.tick(game);
    
    if(actionMade || botAdded || tickResult.deathsOccurred) {
      setBroadcast(game);
    }

    broadcast(game);

    processAchievements(game, tickResult);
  }
}, framesPerSecondInMilliseconds);
