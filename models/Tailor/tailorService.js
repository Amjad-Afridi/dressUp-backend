const mongoose = require("mongoose");
const User = require("./user");
const serviceSchema = mongoose.Schema({
  sName: { type: String, required: true },
  sDes: { type: String },
  sPrice: { type: Number, required: true },
  // ratings: { type: Number, default: 0 },
  imgUrl: { type: String },
  tailor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
module.exports = mongoose.model("TailorService", serviceSchema);
