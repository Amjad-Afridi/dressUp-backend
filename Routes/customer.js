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
} = require("../controllers/customer/customer");
const checkCustomerAuth = require("../middleware/checkCustomerAuth");
router.post("/signup", signup);
router.post("/login", login);
router.post("/profile", upload.single("imgUrl"), createProfile);
router.get("/profile", getProfile);
router.put("/profile/:id", updateProfile);
router.post("/cart", checkCustomerAuth, addToCart);

module.exports = router;
