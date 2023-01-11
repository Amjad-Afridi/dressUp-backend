const express = require("express");
const router = express.Router();
const TailorService = require("../models/tailor/tailorService");
const Tailor = require("../models/tailor/tailor");
const checkAuth = require("../middleware/checkAuth");
const upload = require("../controllers/multerController");

const {
  createService,
  getServices,
  deleteService,
  updateService,
} = require("../controllers/tailor/tailorService");

router.post("/", upload.single("imgUrl"), checkAuth, createService);
router.get("/", getServices);

router.delete("/:id", deleteService);

router.put("/:id", updateService);

module.exports = router;
