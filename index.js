const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Restaurant = require("./models/restaurant");

const connectDB = async () => {
  await mongoose.connect("mongodb://localhost:27017/restaurants");
  console.log("connected");
};

connectDB().catch((err) => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/restaurants", async (req, res) => {
  const restaurants = await Restaurant.find({});
  res.render("restaurants/index", { restaurants });
});

app.get("/restaurants/:id", async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  res.render("restaurants/show", { restaurant });
});

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});
