const mongoose = require("mongoose");
const Rider = require("../../models/rider/rider");
const RiderProfile = require("../../models/rider/riderProfile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OrderTailor = require("../../models/customer/orderTailor");
const RiderCompletedOrders = require("../../models/rider/RiderCompletedOrders");
const { response } = require("express");

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

const createProfile = async (req, res) => {
  const date = new Date();
  const currentDate =
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();

  const profileExists = await RiderProfile.findOne({ rider: req.userId });
  if (profileExists) {
    return res.json({ message: "profile already exists" });
  }

  let profile = await RiderProfile.create({
    userName: req.body.userName,
    imgUrl: req.file.path,
    gender: req.body.gender,
    joinDate: currentDate,
    city: req.body.city,
    phoneNumber: req.body.phoneNumber,
    rider: req.userId,
  });

  await profile.save((err, newProfile) => {
    if (err) return console.error(err);
    res.json(newProfile);
  });
};

const getProfile = async (req, res) => {
  RiderProfile.findOne({ rider: req.userId })
    .select("-rider -__v")
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

const getAvailableOrders = async (req, res) => {
  OrderTailor.find({ orderStatus: "waiting-for-rider" })
    .then((result) => {
      res.status(200).json({ result: result });
    })
    .catch((err) => {
      res.status(500).json({ message: "no orders found " });
    });
};

const acceptOrder = async (req, res) => {
  OrderTailor.findById(req.params.id)
    .then((result) => {
      result.orderStatus = "rider-accepted";
      result.rider = req.userId;
      result.save();
      res.status(200).json({ result: result });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};

const deliveredToTailor = async (req, res) => {
  OrderTailor.findOne({ _id: req.params.id, rider: req.userId })
    .then((result) => {
      if (result.orderStatus === "rider-accepted") {
        result.orderStatus = "pending";
        result.save();
        res.status(200).json({ result: result });
      } else {
        return res
          .status(400)
          .json({ message: "you are not authorized to do this operation" });
      }
    })
    .catch((err) => {
      res.status(500).json({ err });
    });

  const order = await RiderCompletedOrders.create({
    order: req.params.id,
    rider: req.userId,
  });
  order.save();
};

const deliveredToCustomer = async (req, res) => {
  OrderTailor.findOne({ _id: req.params.id, rider: req.userId })
    .then((result) => {
      if (result.orderStatus === "rider-accepted") {
        result.orderStatus = "delivered-to-customer";
        var exchangeLocation = result.pickUpLocation;
        result.pickUpLocation = result.dropUpLocation;
        result.dropUpLocation = exchangeLocation;
        result.save();
        res
          .status(200)
          .json({ message: "rider completed order", result: result });
      } else {
        return res
          .status(400)
          .json({ message: "you are not authorized to do this operation" });
      }
    })
    .catch((err) => {
      res.status(500).json({ err });
    });

  const order = await RiderCompletedOrders.create({
    order: req.params.id,
    rider: req.userId,
  });
  order.save();
};

const deliveryInProgress = async (req, res) => {
  OrderTailor.find({ rider: req.userId, orderStatus: "rider-accepted" })
    .then((result) => {
      res.status(200).json({ result: result });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "no in-progress orders found for this rider" });
    });
};
const completedDeliveries = async (req, res) => {
  RiderCompletedOrders.find({ rider: req.userId })
    .populate({ path: "order", model: "OrderTailor" })
    .select("order")
    .then((result) => {
      res.status(200).json({ result: result });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "no completed orders found for this rider" });
    });
};
module.exports = {
  signup,
  login,
  allRiders,
  createProfile,
  getProfile,
  getAvailableOrders,
  acceptOrder,
  deliveredToTailor,
  deliveredToCustomer,
  deliveryInProgress,
  completedDeliveries,
};
