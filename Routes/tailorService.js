const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const TailorService = require("../models/Tailor/tailorService");
const User = require("../models/Tailor/user");
const checkAuth = require("../middleware/middleware");

const fileLimit = { fileSize: 1024 * 1024 * 5 };
const storage = multer.diskStorage({
  destination: "uploads",
  filename: function (req, file, cb) {
    const uniqueSuffix = Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileLimit: fileLimit,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
});

router.post("/", checkAuth, (req, res) => {
  TailorService.create({
    sName: req.body.sName,
    sDes: req.body.sDes,
    // imgUrl: req.file.imgUrl,
    sPrice: req.body.sPrice,
    tailor: req.body.userId,
  })
    .then((result) => {
      res.status(200).json({
        result,
      });
    })
    .catch((err) => {
      res.status(500).json({ err: err });
    });
});

router.get("/", (req, res) => {
  TailorService.find()
    .populate("tailor")
    .then((result) => {
      result.map((product) => {
        product.imgUrl = product.imgUrl.split("\\").join("/");
      });
      res.status(200).json({
        result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        err,
      });
    });
});

// router.get("/:id", (req, res) => {
//   Products.findById(mongoose.Types.ObjectId(req.params.id))
//     .then((result) => {
//       res.status(200).json({
//         result,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err,
//       });
//     });
// });

// searching by name products :

// router.get("/search/:key", (req, res) => {
//   Products.find({ pName: { $regex: req.params.key } })
//     .then((result) => {
//       res.status(200).json({
//         result,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err,
//       });
//     });
// });

// router.get("/:category", (req, res) => {
//   Products.find({ pCategory: req.params.category })
//     .then((result) => {
//       res.status(200).json({
//         result,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err,
//       });
//     });
// });

router.delete("/:id", (req, res) => {
  TailorService.findByIdAndDelete({ _id: req.params.id })
    .then((result) =>
      res.status(200).json({
        result,
      })
    )
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.put("/:id", (req, res) => {
  TailorService.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then((result) => {
      res.status(200).json({ result });
      console.log(req.body);
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
});

module.exports = router;
