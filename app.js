var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// require routes //
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var productRouter = require('./routes/product');
var orderRouter = require('./routes/order');
// ------------- //

// require dotenv
require('dotenv').config();
// require db
require('./db');
// require Cors
var cors = require('cors');

var app = express();

// use cors
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// api/v1/
app.use('/api/v1/users', usersRouter);
app.use('/api/v1', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
// error code
app.use((err, req, res, next) => {
  if (err) {
    res.status(400).json({
      status: 'error',
      message: 'ข้อมูลไม่ถูกต้อง',
      data: null
    });
  }else{
    res.status(401).json({
      status: 'unauthorized',
      message: 'ไม่มีสิทธิในการเข้าถึงข้อมูล',
      data: null
    });
  }
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
