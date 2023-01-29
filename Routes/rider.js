const express = require("express");
const router = express.Router();
const checkRiderAuth = require("../middleware/checkRiderAuth");
const upload = require("../controllers/multerController");
const {
  signup,
  login,
  allRiders,
  getProfile,
  createProfile,
} = require("../controllers/rider/rider.js");

router.post("/signup", signup);
router.post("/login", login);
router.post("/profile", checkRiderAuth, upload.single("imgUrl"), createProfile);
router.get("/profile", checkRiderAuth, getProfile);
router.get("/", allRiders);
module.exports = router;
