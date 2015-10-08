var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var entries = require('./routes/entries');

var httpManager = require('./workflow/httpManager');

var app = express();

mongoose.connect('mongodb://localhost/contentful-nodejs');

entries.init("cdn.contentful.com", "US_Proxy_Indy.xh1.lilly.com", 9000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// with proxy
// httpManager.httpRequest('uxjqeewlg87p', '1ragifE9PWi4E6gCyGKkQM', '2beee684812f522670e9aeed83f28348dffafe57f72061c59642b46ca2e2f056', "US_Proxy_Indy.xh1.lilly.com", 9000);


app.get('/entries', entries.index);
app.get('/entries/:spaceId/:entryId/:apiKey/:forceRefresh', entries.getSpecificEntry);

// no proxy
// httpManager.httpRequest('uxjqeewlg87p', '1ragifE9PWi4E6gCyGKkQM', '2beee684812f522670e9aeed83f28348dffafe57f72061c59642b46ca2e2f056');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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
