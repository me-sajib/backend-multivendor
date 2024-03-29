require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

const userRoute = require("./routes/users.route");
const orderRoute = require("./routes/order.route");
const productRoute = require("./routes/product.route");
const logger = require("./utils/logger");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use(userRoute);
app.use(orderRoute);
app.use(productRoute);

app.get("/", (req, res) => {
  res.send("Hello Developer");
});

app.use((req, res, next) => {
  logger.log({
    level: "info",
    message: `Request: ${req.method} ${req.url}`,
  });
  next();
});

// not route match
app.use("*", (req, res) => {
  res.status(404).json({
    status: false,
    message: "Route not found",
  });
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Running port on ", process.env.PORT || 4000);
});
