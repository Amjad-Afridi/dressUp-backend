const mongoose = require("mongoose");
const earningSchema = mongoose.Schema({
  riderId: { type: String },
  totalEarnings: { type: Number, default: 0 },
  totalWithdrawn: { type: Number, default: 0 },
});
module.exports = mongoose.model("RiderEarnings", earningSchema);
