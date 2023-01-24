const mongoose = require("mongoose");
const Customer = require("./customer");
const CustomerProfileSchema = mongoose.Schema({
  userName: {
    type: String,
  },
  imgUrl: { type: String },
  joinDate: String,
  city: String,
  gender: {
    type: String,
  },
  phoneNumber: String,
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
});
module.exports = mongoose.model("CustomerProfile", CustomerProfileSchema);
