const mongoose = require("mongoose");
const TailorService = require("./tailorService");
const TailorProfile = require("./tailorProfile");
const registrationSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  contactNumber: { type: Number, minlength: 11 },
});
module.exports = mongoose.model("Tailor", registrationSchema);
