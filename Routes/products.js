const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Products = require("../models/Products/products.js");
const checkAuth = require("../midllewares/check-auth");
router.get("/", (req, res) => {
  Products.find()
    .then((result) => {
      console.log(result);
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
router.post("/", (req, res) => {
  Products.create(req.body)
    .then((result) => {
      res.status(200).json({
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({ err: err });
    });
});

router.get("/:id", (req, res) => {
  Products.findById(req.params.id)
    .then((result) => {
      res.status(200).json({
        result: result,
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
        result: result,
      })
    )
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.put("/:id", (req, res) => {
  Products.findOneAndUpdate({ p_id: req.params.id }, req.body)
    .then((result) => {
      res.status(200).json({ result: result });
      console.log(req.body);
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
});

module.exports = router;
