const mongoose = require("mongoose");
const Tailor = require("./tailor");
const projectDesignsSchema = mongoose.Schema({
  imgUrl: String,
  tailor: { type: mongoose.Schema.Types.ObjectId, ref: "Tailor" },
});
module.exports = mongoose.model("ProjectDesigns", projectDesignsSchema);
