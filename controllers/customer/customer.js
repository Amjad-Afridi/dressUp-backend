const mongoose = require("mongoose");
const Customer = require("../../models/customer/customer.js");
const Product = require("../../models/admin/products.js");
const ProductsCart = require("../../models/customer/productsCart");
const Admin = require("../../models/admin/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const productsOrder = require("../../models/customer/productsOrder.js");
const { findOneAndUpdate } = require("../../models/admin/products.js");
require("dotenv").config();

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
    // .exec()

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

  let profile = await CustomerProfile.create({
    name: req.body.name,
    description: req.body.description,
    imgUrl: req.file.path.split("\\").join("/"),
    languages: req.body.languages,
    keyAreas: req.body.keyAreas,
    joinDate: currentDate,
    location: String,
  });

  await profile.save((err, newProfile) => {
    if (err) return console.error(err);
    res.json(newProfile);
  });
  await Customer.findByIdAndUpdate(
    req.userId,
    {
      $set: { profile: profile._id },
    },
    { new: true }
  );
};

const updateProfile = (req, res) => {
  CustomerProfile.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((result) => {
      res.status(200).json({ result });
      console.log(req);
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};
const getProfile = async (req, res) => {
  Customer.findById(req.userId)
    .populate({ path: "profile" })
    .select("_id")
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

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  product = await Product.findById(productId);
  var cart = await ProductsCart.findOne({ customer: req.userId });
  const price = product.price;
  const name = product.name;
  const imgUrl = product.imgUrl;
  var bill;

  if (!product) {
    res.status(404).send({ message: "product not found" });
    return;
  }
  if (cart) {
    const productIndex = cart.products.findIndex(
      (product) => product.productId == productId
    );
    if (productIndex > -1) {
      let product = cart.products[productIndex];
      product.quantity += quantity;

      cart.bill = cart.products.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0);
      cart.products[productIndex] = product;
      await cart.save();
      res.status(200).send(cart);
    } else {
      cart.products.push({ productId, name, quantity, price });
      cart.bill = cart.products.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0);

      await cart.save();
      res.status(200).send(cart);
    }
  } else {
    cart = await ProductsCart.create({
      customer: req.userId,
      products: [{ productId, name, price, imgUrl, quantity }],
      bill: price * quantity,
    });
  }
};

const deleteItemFromCart = async (req, res) => {
  const productId = req.params.id;
  var product = await Product.findById(productId);
  try {
    var cart = await ProductsCart.findOne({ customer: req.userId });
    productIndex = cart.products.findIndex(
      (product) => product.productId == productId
    );
    if (productIndex > -1) {
      let product = cart.products[productIndex];
      cart.bill -= product.quantity * product.price;
      if (cart.bill < 0) {
        cart.bill = 0;
      }
      cart.products.splice(productIndex, 1);
      cart.bill = cart.products.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0);
      cart = await cart.save();
      res.status(200).send(cart);
    } else {
      res.status(404).send("item not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
};

const getCart = async (req, res) => {
  const userId = req.userId;
  try {
    const cart = await ProductsCart.findOne({ userId });
    if (cart && cart.products.length > 0) {
      res.status(200).json(cart);
    } else {
      res.send(null);
    }
  } catch (error) {
    res.status(500).json();
  }
};

const createOrder = async (req, res) => {
  const date = new Date();
  const currentDate =
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  const userId = req.userId;
  const userCart = await ProductsCart.findOne({ userId });
  const admin = await Admin.findOne({ name: "admin" });
  const order = await productsOrder.create({
    cart: userCart._id,
    orderStatus: "submitted",
    date: currentDate,
  });
  const result = await order.save();
  if (result) {
    res.status(200).json(result);
  } else {
    return res.status(500).json("no order created !!");
  }

  await Admin.findOneAndUpdate(
    admin._id,
    {
      $push: {
        customerOrders: result._id,
      },
    },
    { new: true }
  );

  await Customer.findOneAndUpdate(
    userId,
    {
      $push: {
        orders: result._id,
      },
    },
    { new: true }
  );
  await ProductsCart.findOneAndDelete({ userId });
};

module.exports = {
  signup,
  login,
  createProfile,
  updateProfile,
  getProfile,
  addToCart,
  deleteItemFromCart,
  getCart,
  createOrder,
};
