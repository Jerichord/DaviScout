const express = require("express");
const router = express.Router({ mergeParams: true });
const AsyncCatcher = require("../utilities/AsyncCatcher");
const ExpressError = require("../utilities/ExpressError");
const Restaurant = require("../models/restaurant");
const Review = require("../models/review");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");
const review = require("../models/review");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  AsyncCatcher(reviews.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  AsyncCatcher(reviews.deleteReview)
);

module.exports = router;
