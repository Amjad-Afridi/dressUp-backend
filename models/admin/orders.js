const mongoose = require("mongoose");
const ordersSchema = mongoose.Schema({
  customerOrders: [],
});
module.exports = mongoose.model("Orders", ordersSchema);
