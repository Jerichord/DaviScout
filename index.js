const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

//routes
const userRoutes = require("./routes/users");
const restaurantRoutes = require("./routes/restaurants");
const reviewRoutes = require("./routes/reviews");

//connecting to database. You should have a database running locally using mongo called restaurants
const connectDB = async () => {
  await mongoose.connect("mongodb://localhost:27017/restaurants");
  console.log("connected");
};

connectDB().catch((err) => console.log(err));

//set up template engine to ejs and set directory where ejs is located
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//app engine using ejs-mate
app.engine("ejs", ejsMate);

//set up parser for forms
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//static files
app.use(express.static(path.join(__dirname, "public")));

//sessions for statefulness
const sessionConfig = {
  secret: "zheshisecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() * 1000 * 60 * 60 * 24 * 7, //delete cookie in a week (in ms)
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

//flash
app.use(flash());

//passport for authentication
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//router objects
app.use("/", userRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/restaurants/:id/reviews", reviewRoutes);

//our routes for our app
app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new Error("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oops! Something Went Wrong.";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});
