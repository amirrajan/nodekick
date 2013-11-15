var express = require('express');
var config = require('./config.js').config;
var app = express();
var server = require('http').createServer(app);

app.set('view engine', 'ejs');
app.use('/bower_components', express.static('bower_components'));
app.use('/public', express.static('public'));

app.get('/', function(req, res) { res.render('index'); });

server.listen(process.env.PORT || config.port);
