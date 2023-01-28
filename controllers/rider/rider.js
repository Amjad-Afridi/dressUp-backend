const mongoose = require("mongoose");
const Rider = require("../../models/rider/rider");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signup = (req, res) => {
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      return res.status(200).json({ error: err });
    } else {
      const RiderExits = await Rider.findOne({ email: req.body.email });

      if (!RiderExits) {
        Rider.create({
          name: req.body.name,
          contactNumber: req.body.contactNumber,
          email: req.body.email,
          password: hash,
        }).then((result) => {
          res.status(200).json({ result: result });
        });
      } else {
        res.status(401).json({
          message: "Rider Already exists",
        });
      }
    }
  });
};

const login = (req, res) => {
  Rider.find({ email: req.body.email })
    .then((result) => {
      if (result.length < 1) {
        res.status(401).json({
          message: "Rider does not exist",
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
                  _id: result[0]._id,
                },
                "user registered",
                {
                  expiresIn: "24h",
                }
              );
              res.status(200).json({
                name: result[0].name,
                email: result[0].email,
                _id: result[0]._id,
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
};
const allRiders = async (req, res) => {
  Rider.find({})
    .select("-password -__v")
    .then((customers) => {
      res.status(200).json(customers);
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
};
module.exports = {
  signup,
  login,
  allRiders,
};
