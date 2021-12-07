const mongoose = require("mongoose");
const { Schema } = mongoose;

const RestaurantSchema = new Schema({
  name: String,
  description: String,
  location: String,
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
