const mongoose = require("mongoose");
const Customer = require("../../models/customer/customer.js");
const Products = require("../../models/admin/products.js");
const Admin = require("../../models/admin/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TailorProfile = require("../../models/tailor/tailorProfile.js");
const TailorService = require("../../models/tailor/tailorService.js");
const ProductsOrder = require("../../models/customer/productsOrder.js");
const CustomerProfile = require("../../models/customer/customerProfile.js");
const OrderTailor = require("../../models/customer/orderTailor.js");
const PendingOrders = require("../../models/customer/pendingOrders.js");
const AdminEarnings = require("../../models/admin/earnings.js");
const signup = (req, res) => {
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      return res.status(200).json({ error: err });
    } else {
      const CustomerExits = await Customer.findOne({ email: req.body.email });
      if (!CustomerExits) {
        Customer.create({
          name: req.body.name,
          contactNumber: req.body.contactNumber,
          email: req.body.email,
          password: hash,
        }).then((result) => {
          res.status(200).json({ result: result });
        });
      } else {
        res.status(401).json({
          message: "Customer Already exists",
        });
      }
    }
  });
};

const login = (req, res) => {
  Customer.find({ email: req.body.email })

    .then((result) => {
      if (result.length < 1) {
        res.status(401).json({
          message: "Customer does not exist",
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

  const profileExists = await CustomerProfile.findOne({ customer: req.userId });
  if (profileExists) {
    return res.json({ message: "profile already exists" });
  }

  let profile = await CustomerProfile.create({
    userName: req.body.userName,
    imgUrl: req.file.path,
    gender: req.body.gender,
    joinDate: currentDate,
    city: req.body.city,
    phoneNumber: req.body.phoneNumber,
    customer: req.userId,
  });

  await profile.save((err, newProfile) => {
    if (err) return console.error(err);
    res.json(newProfile);
  });
};

const updateProfile = (req, res) => {
  CustomerProfile.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};
const getProfile = async (req, res) => {
  CustomerProfile.findOne({ customer: req.userId })
    .select("-customer -__v")
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

const createOrder = async (req, res) => {
  const date = new Date();
  const currentDate =
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  const order = await ProductsOrder.create({
    products: req.body.products,
    totalPrice: req.body.totalPrice,
    orderStatus: "pending",
    customerLocation: req.body.customerLocation,
    date: currentDate,
    customer: req.userId,
  });
  const result = await order.save();
  if (result) {
    res.status(200).json(result);
  } else {
    return res.status(500).json("no order created !!");
  }

  var price = Number(req.body.totalPrice);
  const findAdmin = await AdminEarnings.findOne({});
  if (!findAdmin) {
    const newEarning = await AdminEarnings.create({
      totalEarnings: price,
    });
    newEarning.save();
  } else {
    findAdmin.totalEarnings += price;
    await findAdmin.save();
  }
};

const getPendingOrders = async (req, res) => {
  PendingOrders.find({
    customer: req.userId,
  })
    .populate({ path: "order", model: "OrderTailor" })
    .select("order -_id")
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};
const getCompletedOrders = async (req, res) => {
  OrderTailor.find({ customer: req.userId, orderStatus: "completed" })
    .then((result) => {
      res.status(200).json({ result: result });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};

const getNearByTailors = async (req, res) => {
  const { city } = await CustomerProfile.findOne({
    customer: req.userId,
  }).select("city");
  TailorService.find({ city: city })
    .populate({
      path: "tailor",
      model: "Tailor",
      select: "-password -__v",
    })
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

const serviceCategory = async (req, res) => {
  const { city } = await CustomerProfile.findOne({
    customer: req.userId,
  }).select("city");
  TailorService.find({ city: city })
    .then((result) => {
      var services = result.filter((service) =>
        service.serviceType.includes(req.params.category)
      );
      res.status(200).json({
        result: services,
      });
    })
    .catch((err) => {
      res.status(500).json({
        err,
      });
    });
};

const orderTailor = async (req, res) => {
  const { tailor } = await TailorService.findById(req.body.serviceId).select(
    "tailor"
  );
  const { shopLocation } = await TailorProfile.findOne({
    tailor: tailor,
  }).select("shopLocation");
  const date = new Date();
  const currentDate =
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  const order = await OrderTailor.create({
    serviceId: req.body.serviceId,
    tailor: req.body.tailor,
    orderStatus: "waiting-for-rider",
    date: currentDate,
    customer: req.userId,
    price: req.body.price,
    description: req.body.description,
    pickUpLocation: req.body.pickUpLocation,
    dropUpLocation: shopLocation,
    measurementType: req.body.measurementType,
    earning: (Number(req.body.price) * 0.05).toString(),
  });
  const result = await order.save();
  if (result) {
    res.status(200).json(result);
  } else {
    return res.status(500).json("no order created !!");
  }
  await PendingOrders.create({
    order: result._id,
    customer: req.userId,
  });

  var price = Number(req.body.price);
  const findAdmin = await AdminEarnings.findOne({});
  if (!findAdmin) {
    const newEarning = await AdminEarnings.create({
      totalEarnings: price,
    });
    newEarning.save();
  } else {
    findAdmin.totalEarnings += price;
    await findAdmin.save();
  }
};
const allCustomers = async (req, res) => {
  CustomerProfile.find()
    .select("userName imgUrl phoneNumber")
    .then((customers) => {
      res.status(200).json({ result: customers });
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
};

const rateTailorService = async (req, res) => {
  const serviceId = req.body.serviceId;
  const rating = req.body.rating;
  const service = await TailorService.findById(serviceId);
  service.customerRatings.push({ rating: rating, customerId: req.userId });
  await service.save();
  var avgRatings = 0;
  service.customerRatings.map((userRatings) => {
    avgRatings += userRatings.rating;
  });
  service.totalRatings = Math.round(
    avgRatings / service.customerRatings.length
  );
  service.numberOfTimesRated = service.customerRatings.length;
  await service
    .save()
    .then(() => {
      res.status(200).send({ message: "Rating added successfully!" });
    })
    .catch((error) => {
      res.status(400).send({ error: error.message });
    });
};

const completeOrder = async (req, res) => {
  OrderTailor.findById(req.params.id)
    .then((result) => {
      if (result.orderStatus === "delivered-to-customer") {
        result.orderStatus = "completed";
        result.save();
        res.status(200).json({ result: result });
      } else {
        return res.status(400).json({
          message: "you are not authorized to complete the order at the moment",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "no order found to complete" });
    });

  await PendingOrders.findOneAndDelete({ order: req.params.id });
};
module.exports = {
  rateTailorService,
  getNearByTailors,
  signup,
  login,
  createProfile,
  updateProfile,
  getProfile,
  createOrder,
  getPendingOrders,
  getCompletedOrders,
  completeOrder,
  orderTailor,
  allCustomers,
  serviceCategory,
};
