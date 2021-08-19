const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth");

const Order = require("../models/order");
const Product = require("../models/product");

const OrdersController = require("../controllers/orders");
const order = require("../models/order");

//Handle incoming get request to /orders
router.get("/", checkAuth, OrdersController.orders_get_all);

router.post("/", checkAuth, OrdersController.orders_post_one_order);

router.get("/:oerderId", OrdersController.get_order);

router.patch("/:orderId", checkAuth, OrdersController.update_order);

router.delete("/:orderId", checkAuth, OrdersController.remove_order);
module.exports = router;
