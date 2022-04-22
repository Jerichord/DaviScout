const Restaurant = require("../models/restaurant");
const keys = require("dotenv").config();
const mbxGeo = require("@mapbox/mapbox-sdk/services/geocoding");

const mbxTkn = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeo({ accessToken: mbxTkn });
module.exports = {
  index: async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render("restaurants/index", { restaurants });
  },

  renderNewForm: (req, res) => {
    res.render("restaurants/new");
  },

  getRestaurant: async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate({
        path: "reviews", // each restaurant has many reviews
        populate: {
          path: "author", // for each review populate author of that review
        },
      })
      .populate("author"); // then we populate the author for the campground
    if (!restaurant) {
      req.flash("error", "Sorry, cannot find that restaurant!");
      return res.redirect("/restaurants");
    }
    res.render("restaurants/show", { restaurant });
  },

  editRestaurant: async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      req.flash("error", "Sorry, cannot find that restaurant!");
      return res.redirect("/restaurants");
    }
    res.render("restaurants/edit", { restaurant });
  },

  createRestaurant: async (req, res, next) => {
    let location = "Davis CA 95616 ";
    location += req.body.restaurant.location;
    // console.log(location);
    const geoData = await geocoder
      .forwardGeocode({
        query: location,
        limit: 1,
      })
      .send();
    // console.log(geoData.body.features);
    // res.send("ok!");
    const restaurant = new Restaurant(req.body.restaurant);
    restaurant.geometry = geoData.body.features[0].geometry;
    restaurant.author = req.user._id;
    await restaurant.save();
    console.log(restaurant);
    req.flash("success", "successfully made a restaurant!");
    res.redirect(`/restaurants/${restaurant._id}`);
  },

  updateRestaurant: async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, {
      ...req.body.restaurant,
    });
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/restaurants/${restaurant.id}`);
  },

  deleteRestaurant: async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!");
    res.redirect("/restaurants");
  },
};
