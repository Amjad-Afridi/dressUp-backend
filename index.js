const express = require("express");
const app = express();
const studentsRouter = require("./Routes/students");
const userRouter = require("./Routes/user");
const productsRouter = require("./Routes/products");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/students", studentsRouter);
app.use("/user", userRouter);
app.use("/products", productsRouter);
mongoose.connect(process.env.DB_CON_URL, (err) => {
  if (err) console.log(err.message);
  else console.log("connected to the database");
});

app.listen(process.env.PORT, () => {
  console.log("server is listening on port : ", process.env.PORT);
});
