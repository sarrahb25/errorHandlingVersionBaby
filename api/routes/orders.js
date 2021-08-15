const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const order = require("../models/order");

const Order = require("../models/order");
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            quantity: doc.quantity,
            product: doc.product,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        console.log("inside !product condition");
        return res.status(404).json({
          message: "product not found",
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save().then((result) => {
        console.log(result);
        res.status(201).json({
          message: "Order saved",
          createdOrder: {
            id: result._id,
            quantity: result.quantity,
            product: result.productId,
          },
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/:oerderId", (req, res, next) => {
  const orderId = req.params.oerderId;
  Order.findById(orderId)
    .select("_id quantity product")
    .populate("product")
    .exec()
    .then((doc) => {
      if (doc) {
        console.log(doc);
        res.status(200).json({
          order: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/" + doc._id,
          },
        });
      } else {
        res.status(404).json("no valid data with that order ID");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Order.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.delete("/:oerderId", (req, res, next) => {
  Order.deleteOne({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order removed",
        request: {
          type: "POST",
          url: "http://localhost:3000/orders/",
        },
        bode: {
          quantity: "Number",
          productId: "ID",
        },
      });
    });
});
module.exports = router;
