const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//use .use() method to add a function to the project's middleware stack
app.use(morgan('dev'));
app.use(express.json());

//we need to pass in a function that we want to add to our middleware stack
//by adding next as the third argument, express knows that we are defining a middleware
//the middleware functions must come before route handlers
//because the route handler would end the req-res cycle and out middleware wouldn't be executed
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTourById);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//MOUNTING ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
