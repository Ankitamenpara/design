var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var index = require('./routes/index');
var users = require('./routes/users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('client-sessions');
var app = express();
var bcrypt = require('bcryptjs');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({secret: 'max' , saveUninitialized: false, resave: false}));
app.use('/', index);
app.use('/users', users);
app.use(session({
	cookieName: 'session',
	secret: 'max',
	duration : 30* 60 *1000,
	activeDuration: 5*60*1000,
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
