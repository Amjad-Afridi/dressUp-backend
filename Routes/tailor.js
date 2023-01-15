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
router.put("/service/:id", checkTailorAuth, updateService);
router.get("/:id", getTailorById);
router.post(
  "/service",
  upload.single("imgUrl"),
  checkTailorAuth,
  createService
);

module.exports = router;
