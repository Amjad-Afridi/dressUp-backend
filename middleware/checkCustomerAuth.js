const Customer = require("../models/customer/customer");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();
module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "user registered");
    const user = await Customer.findById(decoded._id);
    req.userId = user._id;
    next();
  } catch (err) {
    res.status(401).json({
      error:
        "no token or wrong token or expired token!, unauthorized for this operation!",
    });
  }
};
