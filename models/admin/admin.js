const mongoose = require("mongoose");
const ProductsOrder = require("../customer/productsOrder");
const registrationSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  contactNumber: { type: Number, minlength: 11 },
  customerOrders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductsOrder",
    },
  ],
});
module.exports = mongoose.model("Admin", registrationSchema);
