const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "dbyx5wh8g",
  api_key: "573558398781173",
  api_secret: "CHMLPX-k5BYvZG3MTctFWWaAouo",
});
const storage = new CloudinaryStorage({
  folder: "uploads",
  allowedFormats: ["jpg", "png"],
  transformation: [
    {
      width: 300,
      height: 300,
      crop: "limit",
    },
  ],
  cloudinary: cloudinary,
});
module.exports = multer({ storage: storage });
