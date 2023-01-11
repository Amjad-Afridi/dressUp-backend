const mongoose = require("mongoose");
const TailorService = require("../../models/tailor/tailorService.js");
const Tailor = require("../../models/tailor/tailor");
const createService = async (req, res) => {
  let service = await TailorService.create({
    name: req.body.name,
    description: req.body.description,
    imgUrl: req.file.path.split("\\").join("/"),
    price: req.body.price,
    tailor: req.userId,
  });

  await service.save((err, user) => {
    if (err) return console.error(err);
    res.json(user);
  });
  // const user = Tailor.findById(req.userId);
  await Tailor.findByIdAndUpdate(
    req.userId,
    {
      $push: { services: service._id },
    },
    { new: true }
  );
};

const getServices = (req, res) => {
  TailorService.find({})
    .populate({ path: "tailor", select: "_id name" })
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

const deleteService = (req, res) => {
  TailorService.findByIdAndDelete({ _id: req.params.id })
    .then((result) =>
      res.status(200).json({
        result,
      })
    )
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const updateService = (req, res) => {
  TailorService.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((result) => {
      res.status(200).json({ result });
      console.log(req);
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};
module.exports = {
  createService,
  getServices,
  deleteService,
  updateService,
};
