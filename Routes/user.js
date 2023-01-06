const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const user = require("../models/Tailor/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/signup", (req, res) => {
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      return res.status(200).json({ error: err });
    } else {
      const userExits = await user.findOne({ email: req.body.email });

      if (!userExits) {
        user
          .create({
            name: req.body.name,
            contactNumber: req.body.contactNumber,
            email: req.body.email,
            password: hash,
          })
          .then((result) => {
            res.status(200).json({ result: result });
          });
      } else {
        res.status(401).json({
          message: "user Already exists",
        });
      }
    }
  });
});

router.post("/login", (req, res) => {
  user
    .find({ email: req.body.email })
    // .exec()

    .then((result) => {
      console.log("user exists");
      if (result.length < 1) {
        res.status(401).json({
          message: "user does not exist",
        });
      } else {
        bcrypt.compare(req.body.password, result[0].password, (err, newRes) => {
          if (err) {
            res.status(500).json({
              message: err,
            });
          } else {
            if (newRes) {
              const token = jwt.sign(
                {
                  name: result[0].name,
                  email: result[0].email,
                  id: result[0]._id,
                },
                process.env.USER_KEY,
                {
                  expiresIn: "24h",
                }
              );
              res.status(200).json({
                name: result[0].name,
                email: result[0].email,
                token: token,
              });
            } else {
              res.status(401).json({ mes: "password didn't match !!" });
            }
          }
        });
      }
    })
    .catch((err) => res.status(500).json({ err: err }));
});
module.exports = router;
