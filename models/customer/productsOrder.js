const mongoose = require("mongoose");
const Customer = require("./customer");
const ProductsOrderSchema = mongoose.Schema({
  products: [{}],
  orderStatus: String,

  date: String,
  totalPrice: String,
  customerLocation: String,
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
});
module.exports = mongoose.model("ProductsOrder", ProductsOrderSchema);
