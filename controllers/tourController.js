const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

exports.checkBody = (req, res, next) => {
  console.log(req.body);
  const { name, price } = req.body;

  if (!name || !price)
    return res.status(400).json({
      status: 'fail',
      message: 'Name and price of the tour must be included.',
    });

  next();
};

//ROUTE HANDLERS
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};

exports.getTourById = (req, res) => {
  //read params from the url
  console.log(req.params);

  //multiplying by 1 converts a string into a number
  // const id = req.params.id * 1;

  // const tour = tours.find((el) => el.id === id);
  // // if (id > tours.length) {
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }

  res.status(200).json({
    status: 'success',
    // data: {
    //   tour,
    // },
  });
};

//out of the box, express does not put data on the request
//for that we need to use middleware
//declare: app.use(express.json()); at the top
exports.createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
