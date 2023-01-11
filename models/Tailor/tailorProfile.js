const mongoose = require("mongoose");
const tailorProfileSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  imgUrl: { type: String, default: "uploads/134195-tailor.png" },
  joinDate: String,
  languages: [String],
  keyAreas: [String],
});

module.exports = mongoose.model("TailorProfile", tailorProfileSchema);
