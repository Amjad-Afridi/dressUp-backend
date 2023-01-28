const express = require("express");
const router = express.Router();
const checkRiderAuth = require("../middleware/checkRiderAuth");
const upload = require("../controllers/multerController");
const { signup, login, allRiders } = require("../controllers/rider/rider.js");

router.post("/signup", signup);
router.post("/login", login);
router.get("/", allRiders);
module.exports = router;
