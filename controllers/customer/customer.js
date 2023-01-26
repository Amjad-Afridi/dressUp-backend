const mongoose = require("mongoose");
const Customer = require("../../models/customer/customer.js");
const Products = require("../../models/admin/products.js");
const ProductsCart = require("../../models/customer/productsCart");
const Admin = require("../../models/admin/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TailorService = require("../../models/tailor/tailorService.js");
const ProductsOrder = require("../../models/customer/productsOrder.js");
const CustomerProfile = require("../../models/customer/customerProfile.js");
const Orders = require("../../models/admin/orders.js");
const OrderTailor = require("../../models/customer/orderTailor.js");

// const { findOneAndUpdate } = require("../../models/admin/products.js");
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
      cart.products.push({ productId, imgUrl, name, quantity, price });
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
  const order = await ProductsOrder.create({
    products: req.body.products,
    totalPrice: req.body.totalPrice,
    orderStatus: "pending",
    date: currentDate,
    customer: req.userId,
  });
  const result = await order.save();
  if (result) {
    res.status(200).json(result);
  } else {
    return res.status(500).json("no order created !!");
  }

  const orders = await Orders.findOne({});
  if (!orders) {
    await Orders.create({
      customerOrders: result,
    });
    return;
  }
  await Orders.findOneAndUpdate(
    orders._id,
    {
      $push: {
        customerOrders: result,
      },
    },
    { new: true }
  );
};

const getPendingOrders = async (req, res) => {
  OrderTailor.find({
    customer: req.userId,
    orderStatus: "pending",
  })
    .populate({
      path: "serviceId",
      model: "TailorService",
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};
const getCompletedOrders = async (req, res) => {
  OrderTailor.find({ customer: req.userId, orderStatus: "completed" })
    .populate({
      path: "serviceId",
      model: "TailorService",
    })
    .then((result) => {
      res.status(200).json(result);
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

const orderTailor = async (req, res) => {
  const date = new Date();
  const currentDate =
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  const order = await OrderTailor.create({
    serviceId: req.body.serviceId,
    orderStatus: "pending",
    date: currentDate,
    customer: req.userId,
    price: req.body.price,
    description: req.body.description,
    pickUpLocation: req.body.pickUpLocation,
    dropUpLocation: req.body.dropUpLocation,
    measurementType: req.body.measurementType,
  });
  const result = await order.save();
  if (result) {
    res.status(200).json(result);
  } else {
    return res.status(500).json("no order created !!");
  }
};
module.exports = {
  getNearByTailors,
  signup,
  login,
  createProfile,
  updateProfile,
  getProfile,
  addToCart,
  deleteItemFromCart,
  getCart,
  createOrder,
  getPendingOrders,
  getCompletedOrders,
  orderTailor,
};
