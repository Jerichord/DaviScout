const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const Restaurant = require("./models/restaurant");
const Review = require("./models/review");
const methodOverride = require("method-override");
const ExpressError = require("./utilities/ExpressError");
const AsyncCatcher = require("./utilities/AsyncCatcher");
const { restaurantSchema, reviewSchema } = require("./joiSchemas.js");

const validateRestaurant = (req, res, next) => {
  const { error } = restaurantSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//connecting to database. You should have a database running locally using mongo called restaurants
const connectDB = async () => {
  await mongoose.connect("mongodb://localhost:27017/restaurants");
  console.log("connected");
};

connectDB().catch((err) => console.log(err));

//async utility to catch errors
function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => next(e));
  };
}

//set up template engine to ejs and set directory where ejs is located
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//app engine using ejs-mate
app.engine("ejs", ejsMate);

//set up parser for forms
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//our routes for our app
app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/restaurants",
  AsyncCatcher(async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render("restaurants/index", { restaurants });
  })
);

app.get("/restaurants/new", (req, res) => {
  res.render("restaurants/new");
});

app.get(
  "/restaurants/:id",
  AsyncCatcher(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      "reviews"
    );
    res.render("restaurants/show", { restaurant });
  })
);

app.get(
  "/restaurants/:id/edit",
  AsyncCatcher(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    res.render("restaurants/edit", { restaurant });
  })
);

app.post(
  "/restaurants",
  validateRestaurant,
  AsyncCatcher(async (req, res, next) => {
    if (!req.body.restaurant) throw new ExpressError("Invalid Restaurant", 400);
    const restaurant = new Restaurant(req.body.restaurant);
    await restaurant.save();
    res.redirect(`/restaurants/${restaurant._id}`);
  })
);

app.post(
  "/restaurants/:id/reviews",
  validateReview,
  AsyncCatcher(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    const review = new Review(req.body.review);
    restaurant.reviews.push(review);
    await review.save();
    await restaurant.save();
    res.redirect(`/restaurants/${restaurant._id}`);
  })
);

app.put(
  "/restaurants/:id",
  validateRestaurant,
  AsyncCatcher(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, {
      ...req.body.restaurant,
    });
    res.redirect(`/restaurants/${restaurant.id}`);
  })
);

app.delete(
  "/restaurants/:id",
  AsyncCatcher(async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    res.redirect("/restaurants");
  })
);

app.delete(
  "/restaurants/:id/reviews/:reviewId",
  AsyncCatcher(async (req, res) => {
    const { id, reviewId } = req.params;
    await Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/restaurants/${id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oops! Something Went Wrong.";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});
