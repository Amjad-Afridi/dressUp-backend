const mongoose = require("mongoose");
const Tailor = require("./tailor");
const tailorProfileSchema = mongoose.Schema({
  userName: {
    type: String,
  },
  description: {
    type: String,
  },
  imgUrl: { type: String },
  joinDate: String,
  city: String,
  serviceType: {
    type: String,
  },
  phoneNumber: String,
  tailor: { type: mongoose.Schema.Types.ObjectId, ref: "Tailor" },
});
module.exports = mongoose.model("TailorProfile", tailorProfileSchema);
