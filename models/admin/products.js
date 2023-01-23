const mongoose = require("mongoose");
const productsSchema = mongoose.Schema({
  name: { type: String },
  price: { type: Number },
  description: String,
  category: String,
  imgUrl: { type: String },
});
module.exports = mongoose.model("Products", productsSchema);
