const express = require("express");
const router = express.Router();
const upload = require("../controllers/multerController");
const {
  signup,
  login,
  createProfile,
  updateProfile,
  getProfile,
  addToCart,
  deleteItemFromCart,
  getCart,
  createOrder,
  getCompletedOrders,
  getPendingOrders,
  getNearByTailors,
  orderTailor,
} = require("../controllers/customer/customer");
const checkCustomerAuth = require("../middleware/checkCustomerAuth");
router.post("/signup", signup);
router.post("/login", login);
router.post(
  "/profile",
  checkCustomerAuth,
  upload.single("imgUrl"),
  createProfile
);
router.get("/profile", checkCustomerAuth, getProfile);
router.put("/profile/:id", checkCustomerAuth, updateProfile);
router.post("/cart", checkCustomerAuth, addToCart);
router.delete("/cart/product/:id", checkCustomerAuth, deleteItemFromCart);
router.get("/cart", checkCustomerAuth, getCart);
router.post("/order", checkCustomerAuth, createOrder);
router.get("/completed-orders", checkCustomerAuth, getCompletedOrders);
router.get("/pending-orders", checkCustomerAuth, getPendingOrders);
router.get("/near-tailors", checkCustomerAuth, getNearByTailors);
router.post("/order-tailor", checkCustomerAuth, orderTailor);


module.exports = router;
