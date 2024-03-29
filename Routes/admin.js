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
  getPendingOrders,
  getCompletedOrders,
  getAllOrders,
} = require("../controllers/admin/admin.js");

router.post(
  "/products",
  upload.single("imgUrl"),
  checkAdminAuth,
  createProduct
);
router.post("/signup", signup);
router.post("/login", login);
router.get("/products", allProducts);
router.get("/products/search/:key", searchByName);
router.delete("/products/:id", checkAdminAuth, deleteById);
router.get("/products/:category", getByCategory);
router.put("/products/:id", checkAdminAuth, updateById);
router.get("/orders", checkAdminAuth, getAllOrders);
router.get("/pending-orders", checkAdminAuth, getPendingOrders);
router.get("/completed-orders", checkAdminAuth, getCompletedOrders);

module.exports = router;
