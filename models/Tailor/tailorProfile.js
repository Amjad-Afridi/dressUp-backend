const mongoose = require("mongoose");
const Tailor = require("./tailor");
const tailorProfileSchema = mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  imgUrl: { type: String },
  joinDate: String,
  languages: [String],
  keyAreas: [String],
  location: String,
  gender: {
    type: String,
  },
  tailor: { type: mongoose.Schema.Types.ObjectId, ref: "Tailor" },
});
module.exports = mongoose.model("TailorProfile", tailorProfileSchema);
