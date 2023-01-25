const mongoose = require("mongoose");
const Tailor = require("./tailor");
const serviceSchema = mongoose.Schema({
  name: { type: String },
  description: { type: String },
  price: { type: Number },
  imgUrl: { type: String },
  city: String,
  serviceType: String,
  tailor: { type: mongoose.Schema.Types.ObjectId, ref: "Tailor" },
  ratings: [
    {
      stars: Number,
      postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    },
  ],
});
module.exports = mongoose.model("TailorService", serviceSchema);
