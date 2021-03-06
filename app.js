var express = require('express');
var fs = require("fs");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Configuration
global.config = JSON.parse(fs.readFileSync("config.json", "utf8"));
//global.config = require("./config");
global.url = require("url");

var redis = require("redis");
global.redisClient = redis.createClient(config.redis_port, config.redis_ip);
redisClient.on("error", function (err) {
    console.log("Error:" + err);
})

global.db = require("./databases/"+config.db_driver);
global.dyncutils = require("./utils/dyncutils");
global.dynchttp = require("./utils/dynchttp");

var routes = require('./routes/index');
var users = require('./routes/users');
var meetings = require('./routes/meeting');
var jpush = require('./routes/jpush');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/meeting', meetings);
app.use('/jpush', jpush);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
