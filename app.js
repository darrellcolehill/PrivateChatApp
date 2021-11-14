var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Additional packages installed
var mysql = require('mysql');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
//var db = require('./db');

// Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signupRouter = require('./routes/signup');
var loginRouter = require('./routes/login');
var profileRouter = require('./routes/profile');
var createInboxRouter = require('./routes/createInbox');
var inboxDisplayRouter = require('./routes/inboxDisplay');
var messagesRouter = require('./routes/messages');
var adminRouter = require('./routes/admin');

// initializes the app variable, sets it port to 3000, and listens to request to that port
var app = express();
const PORT = 3000;
app.listen(PORT);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/profile', profileRouter);
app.use('/inboxDisplay', inboxDisplayRouter);
app.use('/createInbox', createInboxRouter);
app.use('/messages', messagesRouter);
app.use('/admin', adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
