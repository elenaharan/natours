const fs = require('fs');
const express = require('express');

const app = express();

//middleware
app.use(express.json());

//define routes
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Noatours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

//marking x as an optional parameter
// app.get('/api/v1/tours/:id/:x?', (req, res) => {
app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);

  //multiplying by 1 converts a string into a number
  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);
  console.log('tour:', tour);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

//out of the box, express does not put data on the request
//for us to send data we need to use middleware
//we need to declare: app.use(express.json()); at the top
app.post('/api/v1/tours', (req, res) => {
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
});


const port = 3000;
//start up a server
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
