const mongoose = require("mongoose");
const ProductsOrder = require("../customer/productsOrder");
const registrationSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  contactNumber: { type: String },
});
module.exports = mongoose.model("Admin", registrationSchema);
