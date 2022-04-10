const express = require("express");
const router = express.Router({ mergeParams: true });
const AsyncCatcher = require("../utilities/AsyncCatcher");
const ExpressError = require("../utilities/ExpressError");
const Restaurant = require("../models/restaurant");
const Review = require("../models/review");
const { validateReview, isLoggedIn } = require("../middleware");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  AsyncCatcher(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    restaurant.reviews.push(review);
    await review.save();
    await restaurant.save();
    req.flash("success", "Successfully made a review!");
    res.redirect(`/restaurants/${restaurant._id}`);
  })
);

router.delete(
  "/:reviewId",
  AsyncCatcher(async (req, res) => {
    // const { id, reviewId } = req.params;
    // await Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // await Review.findByIdAndDelete(reviewId);
    // req.flash("success", "Successfully deleted a review!");
    // res.redirect(`/restaurants/${id}`);
    res.send("delete");
  })
);

module.exports = router;
