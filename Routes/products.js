const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const upload = require("../controllers/multerController");
const {
  createProduct,
  allProducts,
  searchByName,
  deleteById,
  getByCategory,
  updateById,
} = require("../controllers/products/productController.js");

router.post("/", upload.single("imgUrl"), checkAuth, createProduct);
router.get("/", allProducts);
router.get("/search/:key", searchByName);
router.delete("/:id", deleteById);
router.get("/:category", getByCategory);
router.put("/:id", updateById);

module.exports = router;
