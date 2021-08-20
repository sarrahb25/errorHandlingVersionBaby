const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");
const apiErrorHandler = require("./api/middleware/api-error-handler");

mongoose.connect(
  "mongodb+srv://admin:" +
    process.env.MONGO_ALTAS_PW +
    "@cluster0.apqnu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,

    useUnifiedTopology: true,

    useCreateIndex: true,
  }
);
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use("/.uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Method, PUT, POST, PATCH, DELETE, GET");
    res.status(200).json({});
  }
  next();
});

//routes which handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

app.use(apiErrorHandler);

//get here if no route found
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// app.use((error, req, res, next) => {
//   res.status(error.status || 500);
//   res.json({
//     error: {
//       message: error.message,
//     },
//   });
// });

module.exports = app;
