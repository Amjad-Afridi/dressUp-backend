const mongoose = require("mongoose");
const Customer = require("../customer/customer");
const Tailor = require("./tailor");
const serviceSchema = mongoose.Schema({
  name: { type: String },
  description: { type: String },
  price: { type: Number },
  imgUrl: { type: String },
  city: String,
  serviceType: String,
  tailor: { type: mongoose.Schema.Types.ObjectId, ref: "Tailor" },
  customerRatings: [
    {
      rating: Number,
      customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    },
  ],
  totalRatings: { type: Number, default: 0 },
});
module.exports = mongoose.model("TailorService", serviceSchema);
