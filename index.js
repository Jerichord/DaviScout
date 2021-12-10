const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const Restaurant = require("./models/restaurant");
const methodOverride = require("method-override");

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

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/restaurants", async (req, res) => {
  const restaurants = await Restaurant.find({});
  res.render("restaurants/index", { restaurants });
});

app.get("/restaurants/new", (req, res) => {
  res.render("restaurants/new");
});

app.get("/restaurants/:id", async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  res.render("restaurants/show", { restaurant });
});

app.get("/restaurants/:id/edit", async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  res.render("restaurants/edit", { restaurant });
});

app.post("/restaurants", async (req, res) => {
  const restaurant = new Restaurant(req.body.restaurant);
  await restaurant.save();
  res.redirect(`/restaurants/${restaurant._id}`);
});

app.put("/restaurants/:id", async (req, res) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findByIdAndUpdate(id, {
    ...req.body.restaurant,
  });
  res.redirect(`/restaurants/${restaurant.id}`);
});

app.delete("/restaurants/:id", async (req, res) => {
  const { id } = req.params;
  await Restaurant.findByIdAndDelete(id);
  res.redirect("/restaurants");
});

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});
