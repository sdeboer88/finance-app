var express = require('express');
var expressHbs = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var redis = require('redis'); // import redis
var session = require('express-session'); // import express session
var redisStore = require('connect-redis')(session); // import redis storage
var client = redis.createClient();
var bcrypt = require('bcryptjs');

const minifyHTML = require('express-minify-html');
const compression = require('compression');


// Routes
var index = require('./routes/index');
var users = require('./routes/users');
var authentication = require('./routes/authentication');

var api = require('./routes/api');

var app = express();

//connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/finance-app');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () { });

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');

app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(session({
  secret: 'ssshhhhh',
  // create new redis store.
  store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 3600000}),
  saveUninitialized: false,
  resave: false
}));

app.use(minifyHTML({
  override: true,
  exception_url: false,
  htmlMinifier: {
    removeComments: false,
    collapseWhitespace: true,
    collapseBooleanAttributes: false,
    removeAttributeQuotes: false,
    removeEmptyAttributes: false,
    minifyJS: false
  }
}));

app.use(function(req,res,next){
  res.locals.isAuthenticated = req.session.userId;
  next();
})

app.use(compression());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/sign-in', authentication);
app.use('/api', api);

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