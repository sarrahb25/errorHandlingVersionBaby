import http from "http";
import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import userRoutes from "./api/routes/user";

mongoose.connect(
  process.env.MONGO_DSN!!,
  {
    user: process.env.MONGO_USERNAME!!,
    pass: process.env.MONGO_PASSWORD!!,
    dbName: process.env.MONGO_DB_NAME!!,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (error) => {
    if (error) {
      throw error;
    }
  }
);

const app = express();

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

// //routes which handle requests
// app.use("/products", productRoutes);
// app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

// app.use(apiErrorHandler);

//get here if no route found
app.use((req, res, next) => {
  const error = new Error("Not found");
  res.sendStatus(400);
  next(error);
});

const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port);
