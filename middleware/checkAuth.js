const Tailor = require("../models/tailor/tailor");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.USER_KEY);

      const user = await Tailor.findById(decoded._id);
      req.userId = user._id;
      next();
    } else {
      res.status(401).json({
        message: "no login token found",
      });
    }
  } catch (err) {
    res.status(401).json({
      res: "wrong token or expired token!, unauthorized for this operation!",
    });
  }
};
