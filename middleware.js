const { restaurantSchema } = require("./joiSchemas");
const { reviewSchema } = require("./joiSchemas.js");
const Restaurant = require("./models/restaurant");

module.exports = {
  isLoggedIn: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl;
      req.flash("error", "Must be signed in!");
      res.redirect("/login");
    }
    next();
  },

  validateRestaurant: (req, res, next) => {
    const { error } = restaurantSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  },

  validateReview: (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  },

  isAuthor: async (req, res, next) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant.author.equals(req.user._id)) {
      req.flash("error", "You do not have permission to do that.");
      return res.redirect(`/restaurants/${id}`);
    }
    next();
  },
};
