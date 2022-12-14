const mongoose = require("mongoose");
const registrationSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
module.exports = mongoose.model("User", registrationSchema);
