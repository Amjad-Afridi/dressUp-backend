const mongoose = require("mongoose");
const Product = require("../admin/products");
const cartSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
      price: Number,
      name: String,
      imgUrl: String,
    },
  ],
  bill: Number,
});
module.exports = mongoose.model("ProductsCart", cartSchema);
