const path = require("path");
const multer = require("multer");
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
