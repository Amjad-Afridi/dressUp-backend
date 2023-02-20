const mongoose = require("mongoose");
const Rider = require("../../models/rider/rider");
const RiderProfile = require("../../models/rider/riderProfile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OrderTailor = require("../../models/customer/orderTailor");
const RiderCompletedOrders = require("../../models/rider/RiderCompletedOrders");
const { response } = require("express");
const CustomerProfile = require("../../models/customer/customerProfile");
const TailorProfile = require("../../models/tailor/tailorProfile");
const TailorEarnings = require("../../models/tailor/earnings");
const RiderEarnings = require("../../models/rider/earnings");
const AdminEarnings = require("../../models/admin/earnings");
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
  RiderProfile.find()
    .select("userName imgUrl phoneNumber")
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
  var tailorCity;
  var customerCity;
  var price;
  const availableOrders = await OrderTailor.find({
    orderStatus: "waiting-for-rider",
  });
  const result = await Promise.all(
    availableOrders.filter(async (availableOrder) => {
      customerCity = await CustomerProfile.findOne({
        customer: availableOrder.customer,
      }).select("city");

      tailorCity = await TailorProfile.findOne({
        tailor: availableOrder.tailor,
      }).select("city");

      if (customerCity && tailorCity && customerCity.city == tailorCity.city) {
        // price = Number(availableOrder.price) * 0.05;
        // availableOrder.earning = price;
        // console.log(availableOrder);
        return availableOrder;
      }
    })
  );
  res.status(200).json({ result: result });
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
  var tailorId;
  var price;
  await OrderTailor.findOne({ _id: req.params.id, rider: req.userId })
    .then((result) => {
      if (result.orderStatus === "rider-accepted") {
        result.orderStatus = "pending";
        tailorId = result.tailor;
        price = Number(result.price);
        result.save();
        res.status(200).json({ result: result });
      } else {
        return res
          .status(400)
          .json({ message: "you are not authorized to do this operation" });
      }
    })
    .then()
    .catch((err) => {
      res.status(500).json({ err: err.message });
    });

  const order = await RiderCompletedOrders.create({
    order: req.params.id,
    rider: req.userId,
  });
  order.save();

  const findTailor = await TailorEarnings.findOne({ tailorId: tailorId });
  if (!findTailor) {
    const newEarning = await TailorEarnings.create({
      tailorId: tailorId,
      pendingEarnings: price * 0.8,
    });
    await newEarning.save();
  } else {
    findTailor.pendingEarnings += price * 0.8;
    await findTailor.save();
  }

  const findRider = await RiderEarnings.findOne({ riderId: req.userId });
  if (!findRider) {
    const newEarning = await RiderEarnings.create({
      riderId: req.userId,
      totalEarnings: price * 0.05,
    });
  } else {
    findRider.totalEarnings += price * 0.05;
    await findRider.save();
  }

  const findAdmin = await AdminEarnings.findOne({});
  findAdmin.totalEarnings -= price * 0.05;
  await findAdmin.save();
};

const deliveredToCustomer = async (req, res) => {
  var price;
  await OrderTailor.findOne({ _id: req.params.id, rider: req.userId })
    .then((result) => {
      if (result.orderStatus === "rider-accepted") {
        result.orderStatus = "delivered-to-customer";
        var exchangeLocation = result.pickUpLocation;
        result.pickUpLocation = result.dropUpLocation;
        result.dropUpLocation = exchangeLocation;
        price = Number(result.price);
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

  const findRider = await RiderEarnings.findOne({ riderId: req.userId });
  if (!findRider) {
    const newEarning = await RiderEarnings.create({
      riderId: req.userId,
      totalEarnings: price * 0.05,
    });
  } else {
    findRider.totalEarnings += price * 0.05;
    await findRider.save();
  }

  const findAdmin = await AdminEarnings.findOne({});
  findAdmin.totalEarnings -= price * 0.05;
  await findAdmin.save();
};

const deliveryInProgress = async (req, res) => {
  var price;
  OrderTailor.find({ rider: req.userId, orderStatus: "rider-accepted" })
    .then((result) => {
      res.status(200).json({ result: result, earning: price });
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

const riderEarnings = async (req, res) => {
  await RiderEarnings.findOne({ riderId: req.userId })
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((err) => {
      res.status(500).json({ err: err.message });
    });
};

const withdrawnAmount = async (req, res) => {
  var findRider = await RiderEarnings.findOne({ riderId: req.userId });
  findRider.totalWithdrawn += Number(req.body.amount);
  await findRider
    .save()
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((err) => {
      res.status(500).json({ err: err.message });
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
  riderEarnings,
  withdrawnAmount,
};
