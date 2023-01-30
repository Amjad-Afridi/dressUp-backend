const mongoose = require("mongoose");
const Customer = require("./customer");
const Tailor = require("../tailor/tailor");
const TailorService = require("../tailor/tailorService");
const orderTailorSchema = mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "TailorService" },
  orderStatus: {
    type: String,
  },
  date: String,
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  tailor: { type: mongoose.Schema.Types.ObjectId, ref: "Tailor" },
  pickUpLocation: String,
  dropUpLocation: String,
  price: String,
  measurementType: String,
  description: String,
});
module.exports = mongoose.model("OrderTailor", orderTailorSchema);
