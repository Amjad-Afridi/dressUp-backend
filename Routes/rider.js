const express = require("express");
const router = express.Router();
const checkRiderAuth = require("../middleware/checkRiderAuth");
const upload = require("../controllers/multerController");
const { signup, login } = require("../controllers/rider/rider.js");

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
