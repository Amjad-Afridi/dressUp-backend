const mongoose = require("mongoose");
const Tailor = require("../../models/tailor/tailor.js");
const TailorProfile = require("../../models/tailor/tailorProfile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signup = (req, res) => {
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      return res.status(200).json({ error: err });
    } else {
      const TailorExits = await Tailor.findOne({ email: req.body.email });

      if (!TailorExits) {
        Tailor.create({
          name: req.body.name,
          contactNumber: req.body.contactNumber,
          email: req.body.email,
          password: hash,
        }).then((result) => {
          res.status(200).json({ result: result });
        });
      } else {
        res.status(401).json({
          message: "Tailor Already exists",
        });
      }
    }
  });
};

const login = (req, res) => {
  Tailor.find({ email: req.body.email })
    // .exec()

    .then((result) => {
      if (result.length < 1) {
        res.status(401).json({
          message: "Tailor does not exist",
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
                process.env.USER_KEY,
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

const getTailorServices = async (req, res) => {
  const currentTailor = await Tailor.findById(req.userId);
  Tailor.findById(req.userId)
    .populate({ path: "services" })
    .select("name")
    .then((result) => {
      res.status(200).json({
        result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        err,
      });
    });
};

const createProfile = async (req, res) => {
  const date = new Date();
  const currentDate =
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  console.log(currentDate);
  let profile = await TailorProfile.create({
    name: req.body.name,
    description: req.body.description,
    imgUrl: req.file.path.split("\\").join("/"),
    languages: req.body.languages,
    keyAreas: req.body.keyAreas,
    joinDate: currentDate,
    location: String,
  });

  await profile.save((err, newProfile) => {
    if (err) return console.error(err);
    res.json(newProfile);
  });
  await Tailor.findByIdAndUpdate(
    req.userId,
    {
      $set: { profile: profile._id },
    },
    { new: true }
  );
};

const updateProfile = (req, res) => {
  TailorProfile.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((result) => {
      res.status(200).json({ result });
      console.log(req);
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};
const getProfile = async (req, res) => {
  Tailor.findById(req.userId)
    .populate({ path: "profile" })
    .select("_id")
    .then((result) => {
      if (result.profile.imgUrl) {
        result.profile.imgUrl = result.profile.imgUrl.split("\\").join("/");
      }
      res.status(200).json({
        result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        err,
      });
    });
};

const getTailorById = async (req, res) => {
  Tailor.findById(req.param.id)
    .populate({ path: "profile" })
    .select("")
    .then((result) => {
      res.status(200).json({
        result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        err,
      });
    });
};

const getAllTailors = (req, res) => {
  Tailor.find()
    .then((result) => {
      res.status(200).json({
        result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        err,
      });
    });
};
module.exports = {
  signup,
  login,
  getTailorServices,
  createProfile,
  updateProfile,
  getProfile,
  getTailorById,
  getAllTailors,
};
