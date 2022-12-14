const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Student = require("../models/practice/student.js");
const checkAuth = require("../midllewares/check-auth");
router.get("/", checkAuth, (req, res) => {
  Student.find()
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
  Student.create(req.body)
    .then((result) => {
      res.status(200).json({
        newStd: result,
      });
    })
    .catch((err) => {
      res.status(500).json({ err: err });
    });
});

router.get("/:id", (req, res) => {
  Student.findById(req.params.id)
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
  Student.remove({ _id: req.params.id })
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
  Student.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then((result) => {
      res.status(200).json({ result: result });
      // console.log(req.body);
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
});

module.exports = router;
