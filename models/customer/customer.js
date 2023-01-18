const mongoose = require("mongoose");
const ProductsOrder = require("./productsOrder");
const CustomerProfile = require("./customerProfile");
const registrationSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  contactNumber: { type: String },
});
module.exports = mongoose.model("Customer", registrationSchema);
