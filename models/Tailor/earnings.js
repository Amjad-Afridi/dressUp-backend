const mongoose = require("mongoose");
const earningSchema = mongoose.Schema({
  tailorId: { type: String },
  pendingEarnings: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  totalWithdrawn: { type: Number, default: 0 },
});
module.exports = mongoose.model("TailorEarnings", earningSchema);
