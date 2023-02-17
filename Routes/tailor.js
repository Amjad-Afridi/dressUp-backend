const express = require("express");
const router = express.Router();
const upload = require("../controllers/multerController");
const {
  signup,
  login,
  getTailorServices,
  createProfile,
  updateProfile,
  getProfile,
  getTailorById,
  getAllTailors,
  createService,
  deleteService,
  updateService,
  getCompletedOrders,
  getPendingOrders,
  completeOrder,
  uploadImage,
  viewGallery,
  deleteImage,
} = require("../controllers/tailor/tailor");
const checkTailorAuth = require("../middleware/checkTailorAuth");
router.post("/signup", signup);
router.post("/login", login);
router.post(
  "/profile",
  upload.single("imgUrl"),
  checkTailorAuth,
  createProfile
);
router.get("/profile", checkTailorAuth, getProfile);
router.put("/profile/:id", checkTailorAuth, updateProfile);
router.get("/", getAllTailors);
router.get("/service", checkTailorAuth, getTailorServices);
router.delete("/service/:id", checkTailorAuth, deleteService);
router.delete("/delete-image/:id", checkTailorAuth, deleteImage);
router.put("/service/:id", checkTailorAuth, updateService);
router.put("/complete-order/:id", checkTailorAuth, completeOrder);
router.get("/pending-orders", checkTailorAuth, getPendingOrders);
router.get("/completed-orders", checkTailorAuth, getCompletedOrders);
router.get("/view-gallery", checkTailorAuth, viewGallery);
router.get("/:id", getTailorById);
router.post("/service", upload.any("imgUrl"), checkTailorAuth, createService);
router.post(
  "/upload-image",
  upload.single("imgUrl"),
  checkTailorAuth,
  uploadImage
);
module.exports = router;
