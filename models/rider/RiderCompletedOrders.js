const mongoose = require("mongoose");
const Rider = require("./rider");
const OrderTailor = require("../customer/orderTailor");
const orderSchema = mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "OrderTailor" },
  rider: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rider" }],
});
module.exports = mongoose.model("RiderCompletedOrders", orderSchema);
