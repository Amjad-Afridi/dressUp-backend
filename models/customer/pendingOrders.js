const mongoose = require("mongoose");
const Customer = require("./customer");
const OrderTailor = require("./orderTailor");
const pendingOrdersSchema = mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "OrderTailor" },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
});
module.exports = mongoose.model("PendingOrders", pendingOrdersSchema);
