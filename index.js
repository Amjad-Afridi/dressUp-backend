const express = require("express");
const app = express();
const tailorRouter = require("./Routes/tailor");
const adminRouter = require("./Routes/admin");
const customerRouter = require("./Routes/customer");
const riderRouter = require("./Routes/rider.js");

require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/tailor", tailorRouter);
app.use("/customer", customerRouter);
app.use("/admin", adminRouter);
app.use("/rider", riderRouter);
// app.use("/", (req, res) => {
//   res.status(200).json({ message: "home page" });
// });
mongoose.connect(process.env.DB_CON_URL, (err) => {
  if (err) console.log(err.message);
  else console.log("connected to the database");
});

const port = process.env.PORT || 7070;
app.listen(port, () => {
  console.log("server is listening on port : ", port);
});
