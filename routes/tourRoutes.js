const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

//add param middleware that will always run on this router
// router.param('id', tourController.checkId);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
