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

//out of the box, express does not put data on the request
//for us to send data we need to use middleware
//we need to declare: app.use(express.json()); at the top
app.post('/api/v1/tours', (req, res) => {
  //the body is available on the req b/c we used middleware
  console.log(req.body)
  res.send('Done')
});

const port = 3000;
//start up a server
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
