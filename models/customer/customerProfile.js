const mongoose = require("mongoose");
const Customer = require("./customer");
const CustomerProfileSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  imgUrl: { type: String },
  joinDate: String,
  location: String,
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
});
module.exports = mongoose.model("CustomerProfile", CustomerProfileSchema);
