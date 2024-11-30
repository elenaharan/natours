const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

//The first argument is the name of the collection
//mongoose will convert it into lower case plural, i.e. "tours"
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
