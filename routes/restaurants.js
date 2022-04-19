const express = require("express");
const router = express.Router();
const restaurants = require("../controllers/restaurants");
const AsyncCatcher = require("../utilities/AsyncCatcher");
const ExpressError = require("../utilities/ExpressError");
const Restaurant = require("../models/restaurant");

const { isLoggedIn, isAuthor, validateRestaurant } = require("../middleware");
const req = require("express/lib/request");
const restaurant = require("../models/restaurant");
const {
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurants");

router
  .route("/")
  .get(AsyncCatcher(restaurants.index))
  .post(
    isLoggedIn,
    validateRestaurant,
    AsyncCatcher(restaurants.createRestaurant)
  );

router.get("/new", isLoggedIn, restaurants.renderNewForm);

router
  .route("/:id")
  .get(AsyncCatcher(restaurants.getRestaurant))
  .put(
    isLoggedIn,
    validateRestaurant,
    isAuthor,
    AsyncCatcher(restaurants.updateRestaurant)
  )
  .delete(isLoggedIn, isAuthor, AsyncCatcher(restaurants.deleteRestaurant));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  AsyncCatcher(restaurants.editRestaurant)
);

module.exports = router;
