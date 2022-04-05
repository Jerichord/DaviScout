module.exports = {
  isLoggedIn: (req, res, next) => {
    if (!req.isAuthenticated()) {
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
};
