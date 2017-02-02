import _ from 'underscore';
import express from 'express';
import {config} from './config.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import http from 'http';
import socketIO from 'socket.io';
import * as engine from './lib/engine.js';
import {Game} from './lib/game.js';
import * as bot from './lib/bot.js';
import * as achievements from "./lib/achievements.js";
import * as winston from 'winston';

const app = express();
const server = http.createServer(app);
const io = socketIO.listen(server);
const shouldBroadcast = true;
const games = { };
const logFile = 'latency.log';

let latencyMeasurers = [];

app.set('view engine', 'ejs');
app.use('/bower_components', express.static('bower_components'));
app.use('/public', express.static('public'));
app.use('/common', express.static('common'));
app.use(cookieParser());
app.use(session({ 
  secret: "nodekick",
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//http
app.get('/', (req, res) => { res.render('index'); });

app.post('/join', ({body}, res) => {
  let room = body.room;
  if(!room) room = "public";
  res.redirect(`/game/${room}`);
});

app.get("/game/:id", ({params}, res) => {
  getGame(params.id);
  res.render('game');
});

server.listen(process.env.PORT || config.port);

//sockets
function setBroadcast(game) { game.shouldBroadcast = true; }

function broadcast(game) {
  if(!game.shouldBroadcast) return;

  emit(game.id, 'gamestate', {
    frame: engine.getFrame(),
    players: engine.getPlayers(game),
  });

  game.shouldBroadcast = false;
}

function emit(gameId, message, args) {
  const game = getGame(gameId);
  _.each(game.sockets, socket => {
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
  const game = getGame(gameId);
  engine[direction](game, playerId, playerName);
  setBroadcast(game);
}

io.sockets.on('connection', socket => {
  socket.on('joinGame', ({gameId}) => {
    const game = getGame(gameId);
    socket.game = game;
    game.sockets.push(socket);
    setBroadcast(game);
  });

  socket.on('disconnect', () => {
    if(!socket.game) return;

    socket.game.sockets = _.without(socket.game.sockets, socket);
  });

  socket.on('up', ({gameId, playerId, playerName}) => {
    input('up', gameId, playerId, playerName);
  });

  socket.on('down', ({gameId, playerId, playerName}) => {
    input('down', gameId, playerId, playerName);
  });

  socket.on('left', ({gameId, playerId, playerName}) => {
    input('left', gameId, playerId, playerName);
  });

  socket.on('right', ({gameId, playerId, playerName}) => {
    input('right', gameId, playerId, playerName);
  });

  socket.on('sendchat', data => {
    emit(data.session.gameId, 'receivechat', {
      name: data.session.playerName,
      message: data.message
    });
  });

  socket.on('pongpong', ({pingSentTime, pongSentTime}) => {
    latencyMeasurers.push({
      pingSentTime,
      pongSentTime,
      pongReceivedTime: Date.now()
    });
  });
});

function processAchievements({id}, {deaths}) {
  const achievementsThisTick = achievements.get(deaths);

  if(achievementsThisTick.length == 0) return;

  emit(id, 'achievement', achievementsThisTick);
}

const framesPerSecondInMilliseconds = 1000.0 / engine.fps;
let syncRate = 0;

setInterval(() => {
  syncRate += 1;

  for(const key in games) {
    const game = games[key];
    const botAdded = bot.add(game);
    const actionMade = bot.tick(game);
    const tickResult = engine.tick(game);
    const occasionallySync = (syncRate % 300) == 0;

    if(occasionallySync) syncRate = 0;

    if(actionMade ||
       botAdded ||
       tickResult.deathsOccurred ||
       occasionallySync) {
      setBroadcast(game);
    }

    broadcast(game);

    processAchievements(game, tickResult);
  }
}, framesPerSecondInMilliseconds);

// latency logging after every 10 seconds if environment variable set to 'true'
(() => {
  let shouldLog = process.env.SHOULD_LOG_LATENCY;
  if (shouldLog === 'true') {
    const logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({
          formatter: function(options) {
            return options.message;
          }
        }),
        new (winston.transports.File)({
          filename: logFile,
          json: false,
          formatter: function(options) {
            return options.message;
          }
        })
      ]
    });
    setInterval(() => {
      // do we have anything to log
      if (latencyMeasurers.length > 0) {
        let clientCount = latencyMeasurers.length;
        let latencySum = latencyMeasurers.reduce((acc, curr) => {
          return acc + (curr.pongReceivedTime - curr.pingSentTime);
        }, 0);

        // we can now clear out latencyMeasurers
        latencyMeasurers.length = 0;

        // write log to file, and send pings again when done
        let logObj = {
          time: new Date(Date.now() - 10000).toUTCString(),
          numberOfPlayers: clientCount,
          averagePing: (latencySum / clientCount)
        };
        logger.info(JSON.stringify(logObj));
      }
      sendPings();
    }, 10000);
  }
})();

function sendPings() {
  for (const gameId in games) {
    emit(gameId, 'pingping', {
      pingSentTime: Date.now()
    });
  }
}