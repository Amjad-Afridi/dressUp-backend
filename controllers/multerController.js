const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary");
// const cloudinaryStorage = require("multer-storage-cloudinary");
const dotenv = require("dotenv");
dotenv.config();
cloudinary.config({
  cloud_name: "dbyx5wh8g",
  api_key: "573558398781173",
  api_secret: "CHMLPX-k5BYvZG3MTctFWWaAouo",
});
// const storage = cloudinaryStorage({
//   folder: "uploads",
//   allowedFormats: ["jpg", "png"],
//   transformation: [
//     {
//       width: 500,
//       height: 500,
//       crop: "limit",
//     },
//   ],
//   cloudinary: cloudinary,
// });

const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads",
    filename: function (req, file, cb) {
      const uniqueSuffix = Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),

  fileSize: 1024 * 1024 * 5,

  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
});
module.exports = upload;
