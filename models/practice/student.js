const mongoose = require("mongoose");
const studentSchema = mongoose.Schema({
  name: String,
  email: String,
});
module.exports = mongoose.model("Student", studentSchema);
//   _id: mongoose.Schema.Types.ObjectId,