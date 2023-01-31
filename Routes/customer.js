const express = require("express");
const router = express.Router();
const upload = require("../controllers/multerController");
const {
  signup,
  login,
  createProfile,
  updateProfile,
  getProfile,
  createOrder,
  getCompletedOrders,
  getPendingOrders,
  getNearByTailors,
  orderTailor,
  allCustomers,
  rateTailorService,
  completeOrder,
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
router.post("/order", checkCustomerAuth, createOrder);
router.post("/order-tailor", checkCustomerAuth, orderTailor);
router.post("/rate-service", checkCustomerAuth, rateTailorService);
router.get("/completed-orders", checkCustomerAuth, getCompletedOrders);
router.get("/pending-orders", checkCustomerAuth, getPendingOrders);
router.get("/near-tailors", checkCustomerAuth, getNearByTailors);
router.put("/complete-order/:id", checkCustomerAuth, completeOrder);
router.get("/", allCustomers);

module.exports = router;
