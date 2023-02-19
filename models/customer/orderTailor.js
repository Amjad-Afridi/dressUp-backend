const mongoose = require("mongoose");
const Customer = require("./customer");
const Tailor = require("../tailor/tailor");
const Rider = require("../rider/rider");
const TailorService = require("../tailor/tailorService");
const orderTailorSchema = mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "TailorService" },
  orderStatus: {
    type: String,
  },
  date: String,
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  tailor: { type: mongoose.Schema.Types.ObjectId, ref: "Tailor" },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rider",
  },
  pickUpLocation: String,
  dropUpLocation: String,
  price: String,
  measurementType: String,
  description: String,
  earning: String,
});
module.exports = mongoose.model("OrderTailor", orderTailorSchema);
