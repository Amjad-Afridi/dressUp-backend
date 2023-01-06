const mongoose = require("mongoose");
const productsSchema = mongoose.Schema({
  pName: { type: String, required: true },
  pPrice: { type: Number, required: true },
  pDes: String,
  pCategory: String,
  imgUrl: { type: String, required: true },
});
module.exports = mongoose.model("Products", productsSchema);
