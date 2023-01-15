const mongoose = require("mongoose");
const ProductsCart = require("./productsCart");
const ProductsOrderSchema = mongoose.Schema({
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductsCart",
  },
  orderStatus: {
    type: String,
    enum: ["submitted", "pending", "completed", "rejected"],
  },
  date: String,
});
module.exports = mongoose.model("ProductsOrder", ProductsOrderSchema);
