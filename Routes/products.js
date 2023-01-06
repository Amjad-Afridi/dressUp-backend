const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const Products = require("../models/admin/products.js");
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
  // fileFilter: fileFilter,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
});

router.post("/", upload.single("imgUrl"), (req, res) => {
  Products.create({
    pName: req.body.pName,
    pDes: req.body.pDes,
    pPrice: req.body.pPrice,
    imgUrl: req.file.path,
    pCategory: req.body.pCategory,
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
  Products.find()
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

router.get("/search/:key", (req, res) => {
  Products.find({ pName: { $regex: req.params.key } })
    .then((result) => {
      res.status(200).json({
        result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:category", (req, res) => {
  Products.find({ pCategory: req.params.category })
    .then((result) => {
      res.status(200).json({
        result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:id", (req, res) => {
  Products.findByIdAndDelete({ _id: req.params.id })
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
  Products.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then((result) => {
      res.status(200).json({ result });
      console.log(req.body);
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
});

module.exports = router;
