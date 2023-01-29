const mongoose = require("mongoose");
const Rider = require("./rider");
const riderProfileSchema = mongoose.Schema({
  userName: {
    type: String,
  },
  imgUrl: { type: String },
  joinDate: String,
  city: String,
  gender: {
    type: String,
  },
  phoneNumber: String,
  rider: { type: mongoose.Schema.Types.ObjectId, ref: "Rider" },
});
module.exports = mongoose.model("RiderProfile", riderProfileSchema);
