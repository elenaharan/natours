// review / rating/ createdAt/ ref to Tour/ ref to User
const mongoose = require('mongoose');
const Tour = require('./tourModel');

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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

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
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  //this keyword points to current review
  //calling constructor method because review schema is not yet created
  //and we cannot simply call Review.calcAverage
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  //this keyword points to current query, not current doc
  //we need to execute query and that will give us access to the doc
  //here the review will be the old one, prior to being update - b/c this is a "pre" middleware
  //this.review -> we're attaching review property to the query, so that in the next middleware we can access tourId on that property
  this.review = await this.model.findOne(this.getFilter());
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  if (!this.review) return;

  await this.review.constructor.calcAverageRatings(this.review.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
