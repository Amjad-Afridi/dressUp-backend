const mongoose = require("mongoose");
const Customer = require("./customer");
const ProductsOrderSchema = mongoose.Schema({
  products: [{}],
  orderStatus: {
    type: String,
  },
  date: String,
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
});
module.exports = mongoose.model("ProductsOrder", ProductsOrderSchema);
