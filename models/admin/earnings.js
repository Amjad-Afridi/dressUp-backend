const mongoose = require("mongoose");
const earningSchema = mongoose.Schema({
  totalEarnings: { type: Number, default: 0 },
});
module.exports = mongoose.model("AdminEarnings", earningSchema);
