const express = require("express");
const app = express();
const userRouter = require("./Routes/user");
const productsRouter = require("./Routes/products");
const tailorServiceRouter = require("./Routes/tailorService");
const checkAuth = require("./middleware/middleware");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
// app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/user", userRouter);
app.use("/products", productsRouter);
app.use("/tailorService", tailorServiceRouter);
mongoose.connect(process.env.DB_CON_URL, (err) => {
  if (err) console.log(err.message);
  else console.log("connected to the database");
});

const port = process.env.PORT || 7070;
app.listen(port, () => {
  console.log("server is listening on port : ", process.env.PORT);
});
