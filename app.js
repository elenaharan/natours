const fs = require('fs');
const express = require('express');

const app = express();

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
  res.status(200).json(tours);
});

const port = 3000;
//start up a server
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
