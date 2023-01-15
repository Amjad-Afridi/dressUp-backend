const express = require("express");
const router = express.Router();
const checkAdminAuth = require("../middleware/checkAdminAuth");
const upload = require("../controllers/multerController");
const {
  signup,
  login,
  createProduct,
  allProducts,
  searchByName,
  deleteById,
  getByCategory,
  updateById,
  getCustomerOrders,
} = require("../controllers/admin/admin.js");

router.post(
  "/products",
  upload.single("imgUrl"),
  checkAdminAuth,
  createProduct
);
router.post("/signup", signup);
router.post("/login", login);
router.get("/products", checkAdminAuth, allProducts);
router.get("/products/search/:key", checkAdminAuth, searchByName);
router.delete("/products/:id", checkAdminAuth, deleteById);
router.get("/products/:category", checkAdminAuth, getByCategory);
router.put("/products/:id", checkAdminAuth, updateById);
router.get("/customer-orders", checkAdminAuth, getCustomerOrders);

module.exports = router;
