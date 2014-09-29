var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var expressLayouts = require('express-ejs-layouts');

// Using passportjs for implementing authentication
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

//DB Connection
var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/test';
var mongoose = require('mongoose');
mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout','./layout/layout.ejs');
app.set("layout extractScripts", true);

//Setting helper functions
app.locals.app_helper = require('./helpers/app_helper');

//Putting this here to avoid circular dependencies
module.exports = app;

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);

// For authentication
app.use(session({
  secret: process.env.EXPRESS_SECRET || 'Random String',
  key: 'sid',
  resave: true,
  saveUninitialized: true,
  cookie: {secure: false},
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var auth_routes = require('./routes/auth_routes');
var home_routes = require('./routes/index');

app.use('/', home_routes);
app.use('/',auth_routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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

var http = require('http').Server(app);
var httpport = process.env.PORT || 3000;

http.listen(httpport, function(){
    console.log('listening on *:'+httpport);
});
