var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
let { CreateErrorRes } = require("./utils/responseHandler");


let cors = require("cors");


var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

mongoose.connect("mongodb://localhost:27017/S5");
mongoose.connection.on("connected", () => {
  console.log("connected");
});
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/roles", require("./routes/roles"));
app.use("/auth", require("./routes/auth"));
app.use("/products", require("./routes/products"));
app.use("/productAttribute", require("./routes/productAttribute"));
app.use("/supplier", require("./routes/supplier"));
app.use("/categories", require("./routes/categories"));
app.use("/orders", require("./routes/orders"));
app.use("/stocks", require("./routes/stock"));
app.use("/inventory", require("./routes/inventory"));
app.use("/library", require("./routes/library"));
app.use("/orderDetails", require("./routes/orderdetails"));
app.use("/carts", require("./routes/cart"));
app.use("/likes", require("./routes/like"));
app.use("/transactionHistory", require("./routes/transactionHistory"));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  CreateErrorRes(res, err.message, err.status || 500);
});

// Cors
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

module.exports = app;
