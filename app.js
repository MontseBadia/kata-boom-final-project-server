'use strict';

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const kataRouter = require('./routes/kata');
const userRouter = require('./routes/user');

const app = express();

// ------ DB CONNECTION -------

const config = {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true
};

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI, config);

// ------ MIDDLEWARES -------

app.use(cors({
  credentials: true,
  origin: [process.env.CLIENT_URL]
}));
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  secret: 'some-string',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  app.locals.currentUser = req.session.currentUser;
  next();
});

// ------ ROUTES -------

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/kata', kataRouter);
app.use('/user', userRouter);

// ------ ERROR HANDLER -------

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({ code: 'not found' });
});

app.use((err, req, res, next) => {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500).json({ code: 'unexpected' });
  }
});

module.exports = app;
