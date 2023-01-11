const mongoose = require("mongoose");
const productsSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  pCategory: String,
  imgUrl: { type: String, required: true },
});
module.exports = mongoose.model("Products", productsSchema);
