const mongoose = require("mongoose");
const Tailor = require("./tailor");
const serviceSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  imgUrl: { type: String },
  tailor: { type: mongoose.Schema.Types.ObjectId, ref: "Tailor" },
  ratings: [
    {
      stars: Number,
      postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    },
  ],
});
module.exports = mongoose.model("TailorService", serviceSchema);
