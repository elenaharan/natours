const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

//1) MIDDLEWARES

//use .use() method to add a function to the project's middleware stack
app.use(morgan('dev'));
app.use(express.json());

//we need to pass in a function that we want to add to our middleware stack
//by adding next as the third argument, express knows that we are defining a middleware
//the middleware functions must come before route handlers
//because the route handler would end the req-res cycle and out middleware wouldn't be executed 
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋')
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`)
);

//2) ROUTE HANDLERS

const getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTourById = (req, res) => {
  //read params from the url
  console.log(req.params);

  //multiplying by 1 converts a string into a number
  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);
  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  console.log('tour:', tour);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

//out of the box, express does not put data on the request
//for that we need to use middleware
//declare: app.use(express.json()); at the top
const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

const getUserById = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTourById);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//3) ROUTE
app.use('/api/v1/tours', tourRouter);
app.use('api/v1/users', usersRouter);

const tourRouter = express.Router();
tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour);

const usersRouter = express.Router();
usersRouter.route('/').get(getAllUsers).post(createUser);
app.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);

//4) START SERVER
const port = 3000;

app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
