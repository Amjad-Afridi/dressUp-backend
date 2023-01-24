const mongoose = require("mongoose");
const Tailor = require("../../models/tailor/tailor.js");
const TailorProfile = require("../../models/tailor/tailorProfile");
const TailorService = require("../../models/tailor/tailorService.js");
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

const createProfile = async (req, res) => {
  const date = new Date();
  const currentDate =
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  const profileExists = await TailorProfile.findOne({ tailor: req.userId });
  if (profileExists) {
    return res.json({ message: "Profile already exists" });
  }
  let profile = await TailorProfile.create({
    userName: req.body.name,
    description: req.body.description,
    imgUrl: req.file.path,
    joinDate: currentDate,
    city: req.body.city,
    serviceType: req.body.serviceType,
    phoneNumber: req.body.phoneNumber,
    tailor: req.userId,
  });

  await profile.save((err, newProfile) => {
    if (err) return console.error(err);
    res.json(newProfile);
  });
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
  TailorProfile.findOne({ tailor: req.userId })
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

const getTailorById = async (req, res) => {
  const service = await TailorService.find({ tailor: req.params.id });
  const profile = await TailorProfile.findOne({ tailor: req.params.id });
  Tailor.findById(req.params.id)
    .select("-password")
    .then((tailor) => {
      res.status(200).json({
        tailor,
        profile,
        service,
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
    .select("-password")
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

const createService = async (req, res) => {
  let service = await TailorService.create({
    name: req.body.name,
    description: req.body.description,
    imgUrl: req.file.path,
    price: req.body.price,
    tailor: req.userId,
  });

  await service.save((err, user) => {
    if (err) return console.error(err);
    res.json(user);
  });
};

const getTailorServices = (req, res) => {
  TailorService.find({ tailor: req.userId })
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

const deleteService = async (req, res) => {
  const service = await TailorService.findByIdAndDelete({ _id: req.params.id });
  if (service) {
    res.status(200).json({ service });
  } else {
    return res.status(500).json({ err: "no service to delete !" });
  }
};

const updateService = (req, res) => {
  TailorService.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};

module.exports = {
  signup,
  login,
  createProfile,
  updateProfile,
  getProfile,
  getTailorById,
  getAllTailors,
  createService,
  getTailorServices,
  deleteService,
  updateService,
};
