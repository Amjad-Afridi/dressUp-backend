const mongoose = require("mongoose");
const productsSchema = mongoose.Schema({
  p_name: String,
  p_price: Number,
  p_des: String,
  img_url: String,
});
module.exports = mongoose.model("products", productsSchema);
