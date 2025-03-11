const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//1) GLOBAL MIDDLEWARES
//serving static files
app.use(express.static(path.join(__dirname, 'public')));

//SET SECURITY HTTP HEADERS
app.use(helmet());

//use .use() method to add a function to the project's middleware stack
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//LIMIT REQUEST FROM SAME IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

//specifying the route would trigger limiter only on those routes that contains /api in the url
app.use('/api', limiter);

//out of the box, express does not put data on the request
//for that we need to use middleware
//declare: app.use(express.json()); at the top
//BODY PARSER, reading data from body into req.body
//limit body of the req to 10kb
app.use(
  express.json({
    limit: '10kb',
  }),
);

//DATA SANITIZATION against NoSQL query injection
app.use(mongoSanitize());

//DATA SANITIZATION against XSS (Cross-site scripting attacks)
app.use(xss());

//prevent parameter pollution - this middleware should be used by the end b/c it prevents param pollution
//it will use the last param
//we can whitelist some params that we allow to be duplicates in the query
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

//MOUNTING ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.get('/api/mapbox-token', (req, res) => {
  res.json({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
});

//by specifying 4 params with the first param being an err, express automatically know this is an error handling middleware
app.use(globalErrorHandler);

module.exports = app;
