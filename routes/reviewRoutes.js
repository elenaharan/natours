const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

//we need to set mergeParams to true so that reviews router has access to url params from the tour router
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .patch(
    authController.restrictTo('admin', 'user'),
    reviewController.updateReview,
  )
  .delete(
    authController.restrictTo('admin', 'user'),
    reviewController.deleteReview,
  )
  .get(reviewController.getReviewById);

module.exports = router;
