const mongoose = require("mongoose");
const Products = require("../../models/admin/products");
const Admin = require("../../models/admin/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findById } = require("../../models/admin/products");
require("dotenv").config();

const signup = (req, res) => {
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      return res.status(200).json({ error: err });
    } else {
      const AdminExits = await Admin.findOne({ email: req.body.email });

      if (!AdminExits) {
        Admin.create({
          name: req.body.name,
          contactNumber: req.body.contactNumber,
          email: req.body.email,
          password: hash,
        }).then((result) => {
          res.status(200).json({ result: result });
        });
      } else {
        res.status(401).json({
          message: "Admin Already exists",
        });
      }
    }
  });
};

const login = (req, res) => {
  Admin.find({ email: req.body.email })
    .then((result) => {
      if (result.length < 1) {
        res.status(401).json({
          message: "Admin does not exist",
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

const createProduct = (req, res) => {
  Products.create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    imgUrl: req.file.path.split("\\").join("/"),
    category: req.body.category,
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
  Products.findByIdAndDelete({ _id: req.params.id }, { new: true })
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
  Products.find({ category: req.params.category })
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
const getCustomerOrders = async (req, res) => {
  const admin = await Admin.findById(req.userId).populate({
    path: "customerOrders",
    populate: {
      path: "cart",
    },
  });

  // .populate({
  //   path: "customerOrders.cart",
  // });
  console.log(admin);
  // if (admin.customerOrders.length > 0) {
  //   res.status(200).json(admin.customerOrders);
  // } else {
  //   res.status(200).json({ err: "no customer orders found" });
  // }
};
module.exports = {
  signup,
  login,
  createProduct,
  allProducts,
  searchByName,
  deleteById,
  getByCategory,
  updateById,
  getCustomerOrders,
};
