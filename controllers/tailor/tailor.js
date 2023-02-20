const mongoose = require("mongoose");
const Tailor = require("../../models/tailor/tailor.js");
const TailorProfile = require("../../models/tailor/tailorProfile");
const TailorService = require("../../models/tailor/tailorService.js");
const OrderTailor = require("../../models/customer/orderTailor");
const ProjectDesigns = require("../../models/tailor/projectDesigns.js");
const TailorEarnings = require("../../models/tailor/earnings.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminEarnings = require("../../models/admin/earnings.js");

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
    userName: req.body.userName,
    description: req.body.description,
    imgUrl: req.file.path,
    joinDate: currentDate,
    city: req.body.city,
    shopLocation: req.body.shopLocation,
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

const getAllTailors = async (req, res) => {
  TailorProfile.find()
    .select("userName imgUrl phoneNumber")
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
  var service = await TailorService.findOne({
    tailor: req.userId,
  });

  if (!service) {
    var serviceType = req.body.serviceType.split(" ");
    var files = req.files.map((file) => {
      return file.path;
    });

    TailorService.create({
      name: req.body.name,
      description: req.body.description,
      imgUrl: files,
      price: req.body.price,
      serviceType: serviceType,
      city: req.body.city,
      tailor: req.userId,
      expectedDelivery: req.body.expectedDelivery,
    })
      .then((result) => {
        res.status(200).json({ result });
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  } else {
    return res.status(400).json({ message: "can't create service again !" });
  }
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
const getPendingOrders = async (req, res) => {
  OrderTailor.find({
    tailor: req.userId,
    orderStatus: "pending",
  })
    .then((result) => {
      res.status(200).json({ result: result });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};
const getCompletedOrders = async (req, res) => {
  OrderTailor.find({ tailor: req.userId, orderStatus: "completed" })
    .then((result) => {
      res.status(200).json({ result: result });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};

const completeOrder = async (req, res) => {
  var tailorId;
  var price;
  await OrderTailor.findById(req.params.id)
    .then((result) => {
      if (result.orderStatus === "pending") {
        tailorId = result.tailor;
        price = Number(result.price);
        result.orderStatus = "waiting-for-rider";
        var exchangeLocation = result.pickUpLocation;
        result.pickUpLocation = result.dropUpLocation;
        result.dropUpLocation = exchangeLocation;
        if (result.towardsCustomer) {
          result.towardsCustomer = true;
        }
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
  await OrderTailor.findByIdAndUpdate(req.params.id, {
    $unset: { rider: "" },
    new: true,
  });

  const findTailor = await TailorEarnings.findOne({ tailorId: req.userId });
  findTailor.pendingEarnings -= price * 0.8;
  findTailor.totalEarnings += price * 0.8;
  await findTailor.save();

  const findAdmin = await AdminEarnings.findOne({});
  findAdmin.totalEarnings -= price * 0.8;
  await findAdmin.save();
};

const uploadImage = async (req, res) => {
  ProjectDesigns.create({
    imgUrl: req.file.path,
    tailor: req.userId,
  })
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};

const viewGallery = async (req, res) => {
  ProjectDesigns.find({ tailor: req.userId })
    .select("-__v -tailor")
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};

const deleteImage = async (req, res) => {
  ProjectDesigns.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};

const tailorEarnings = async (req, res) => {
  await TailorEarnings.findOne({ tailorId: req.userId })
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((err) => {
      res.status(500).json({ err: err.message });
    });
};

const withdrawnAmount = async (req, res) => {
  var findTailor = await TailorEarnings.findOne({ tailorId: req.userId });
  findTailor.totalWithdrawn += Number(req.body.amount);
  await findTailor
    .save()
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((err) => {
      res.status(500).json({ err: err.message });
    });
};

module.exports = {
  withdrawnAmount,
  uploadImage,
  deleteImage,
  viewGallery,
  getPendingOrders,
  getCompletedOrders,
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
  completeOrder,
  tailorEarnings,
};
