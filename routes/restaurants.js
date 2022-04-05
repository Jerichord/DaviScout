const express = require("express");
const router = express.Router();
const AsyncCatcher = require("../utilities/AsyncCatcher");
const ExpressError = require("../utilities/ExpressError");
const Restaurant = require("../models/restaurant");

const { restaurantSchema } = require("../joiSchemas.js");

const { isLoggedIn } = require("../middleware");

const { validateRestaurant } = require("../middleware");
const req = require("express/lib/request");

// const validateRestaurant = (req, res, next) => {
//   const { error } = restaurantSchema.validate(req.body);
//   if (error) {
//     const msg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(msg, 400);
//   } else {
//     next();
//   }
// };

router.get(
  "/",
  AsyncCatcher(async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render("restaurants/index", { restaurants });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("restaurants/new");
});

router.get(
  "/:id",
  AsyncCatcher(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      "reviews"
    );
    if (!restaurant) {
      req.flash("error", "Sorry, cannot find that restaurant!");
      return res.redirect("/restaurants");
    }
    res.render("restaurants/show", { restaurant });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  AsyncCatcher(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      req.flash("error", "Sorry, cannot find that restaurant!");
      return res.redirect("/restaurants");
    }
    res.render("restaurants/edit", { restaurant });
  })
);

router.get("/logout", (re1, res) => {
  req.logout();
  req.flash("success", "Successfully logged out.");
  res.redirect("/restaurants");
});

router.post(
  "/",
  isLoggedIn,
  validateRestaurant,
  AsyncCatcher(async (req, res, next) => {
    if (!req.body.restaurant) throw new ExpressError("Invalid Restaurant", 400);
    const restaurant = new Restaurant(req.body.restaurant);
    await restaurant.save();
    req.flash("success", "successfully made a restaurant!");
    res.redirect(`/restaurants/${restaurant._id}`);
  })
);

router.put(
  "/:id",
  isLoggedIn,
  validateRestaurant,
  AsyncCatcher(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, {
      ...req.body.restaurant,
    });
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/restaurants/${restaurant.id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  AsyncCatcher(async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!");
    res.redirect("/restaurants");
  })
);

module.exports = router;
