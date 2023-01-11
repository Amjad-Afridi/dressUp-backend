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
} = require("../controllers/tailor/tailor");
const checkAuth = require("../middleware/checkAuth");
router.post("/signup", signup);
router.post("/login", login);
router.get("/services", checkAuth, getTailorServices);
router.post("/profile", upload.single("imgUrl"), checkAuth, createProfile);
router.get("/profile", checkAuth, getProfile);
router.put("/profile/:id", checkAuth, updateProfile);
router.put("/allTailors", checkAuth, getAllTailors);
router.put("/:id", checkAuth, getTailorById);
module.exports = router;
