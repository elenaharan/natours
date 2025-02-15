// review / rating/ createdAt/ ref to Tour/ ref to User
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review field cannot be empty'],
      maxLength: [200, 'Your review exceeded maximum length'],
      minLength: [2, 'Your review is too short.'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  //specify that virtual properties will show up in JSON and object output
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

//we are using statics method here because we are running a function on the entire collection
//this keyword here refers to the entire model, not a document
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: {tour: tourId}
    },
    {
      $group: {
        _id: '$tour',
        nRating: {$sum: 1},
        avgRating: {$avg: '$rating'}
      }
    }
  ]);

  console.log(stats);
};

reviewSchema.post('save', function() {
  //this keyword points to current review
  this.constructor.calcAverageRatings(this.tour);
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
