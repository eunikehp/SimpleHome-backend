var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const FileStore = require('session-file-store')(session);


//import
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const productRouter = require('./routes/productRouter');

//connect to mongodb
const url = 'mongodb://localhost:27017/simplehome';
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
connect.then(() => console.log('Connected correctly to server'),
  err => console.log(err)
);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-09876-54321'));

//session
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);


//authentication and session after adding Router endpoints on user
function auth(req, res, next) {
  console.log(req.session);

  if (!req.session.user) {
    const err = new Error('You are not authenticated!');
    err.status = 401;
    return next(err);
  } else {
    if (req.session.user === 'authenticated') {
        return next();
    } else {
        const err = new Error('You are not authenticated!');
        err.status = 401;
        return next(err);
    }
  }
}

// //authentication and session
// function auth(req, res, next) {
//   console.log(req.session);

//   if (!req.session.user) {
//       const authHeader = req.headers.authorization;
//       if (!authHeader) {
//           const err = new Error('You are not authenticated!');
//           res.setHeader('WWW-Authenticate', 'Basic');
//           err.status = 401;
//           return next(err);
//       }

//       const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//       const user = auth[0];
//       const pass = auth[1];
//       if (user === 'admin' && pass === 'password') {
//           req.session.user = 'admin';
//           return next(); // authorized
//       } else {
//           const err = new Error('You are not authenticated!');
//           res.setHeader('WWW-Authenticate', 'Basic');
//           err.status = 401;
//           return next(err);
//       }
//   } else {
//       if (req.session.user === 'admin') {
//           return next();
//       } else {
//           const err = new Error('You are not authenticated!');
//           err.status = 401;
//           return next(err);
//       }
//   }
// }

// //authentication and cookies
// function auth(req, res, next) {
//   if (!req.signedCookies.user) {
//       const authHeader = req.headers.authorization;
//       if (!authHeader) {
//           const err = new Error('You are not authenticated!');
//           res.setHeader('WWW-Authenticate', 'Basic');
//           err.status = 401;
//           return next(err);
//       }

//       const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//       const user = auth[0];
//       const pass = auth[1];
//       if (user === 'admin' && pass === 'password') {
//           res.cookie('user', 'admin', {signed: true});
//           return next(); // authorized
//       } else {
//           const err = new Error('You are not authenticated!');
//           res.setHeader('WWW-Authenticate', 'Basic');
//           err.status = 401;
//           return next(err);
//       }
//   } else {
//       if (req.signedCookies.user === 'admin') {
//           return next();
//       } else {
//           const err = new Error('You are not authenticated!');
//           err.status = 401;
//           return next(err);
//       }
//   }
// }

//authentication
// function auth(req,res,next) {
//   console.log(req.headers);
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     const err = new Error ('You are not authenticated!');
//     res.setHeader('WWW-Authenticate', 'Basic');
//     err.status = 401;
//     return next(err);
//   }
//   //parse the authorization header and validate username and password
//   const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//   // once the string is decoded, it shows the username and password separately admin:password => ['admin','password']
//   const user = auth[0];
//   const pass = auth[1];
//   if ( user === 'admin' && pass === 'password') {
//     return next(); //authorized
//   } else {
//     const err = new Error ('You are not authenticated');
//     res.setHeader('WWW-Authenticate', 'Basic');
//     err.status= 401;
//     return next(err)
//   }
// }
app.use(auth);


app.use(express.static(path.join(__dirname, 'public')));


app.use('/products', productRouter);


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
