const mongoose = require("mongoose");
const Products = require("../../models/admin/products");

const createProduct = (req, res) => {
  Products.create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    imgUrl: req.file.path.split("\\").join("/"),
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
};

const allProducts = (req, res) => {
  console.log(req.user);
  Products.find()
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

const searchByName = (req, res) => {
  Products.find({ name: { $regex: req.params.key } })
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
};

const deleteById = (req, res) => {
  Products.findByIdAndDelete({ _id: req.params.id })
    .then((result) =>
      res.status(200).json({
        result,
      })
    )
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const getByCategory = (req, res) => {
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
};

const updateById = (req, res) => {
  Products.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};

module.exports = {
  createProduct,
  allProducts,
  searchByName,
  deleteById,
  getByCategory,
  updateById,
};
