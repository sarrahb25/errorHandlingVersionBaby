const mongoose = require("mongoose");
const { ValidationError, NotFoundError } = require("../../error/error");
const CastError = require("mongoose/lib/error/cast");
const Order = require("../models/order");
const Product = require("../models/product");

exports.orders_get_all = (req, res, next) => {
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
};

// this is a HOF: it extends the promise returned by handler to catch any error returned
// using the default error handler in express (which is "next")
const withAsyncError = (handler) => (req, res, next) =>
  handler(req, res, next).catch(next);

exports.orders_post_one_order = withAsyncError(async (req, res, next) => {
  // throw new Error("failed")
  console.log("here", req.body.productId);
  try {
    const product = await Product.findById(req.body.productId);
    if (!product) {
      console.log("inside product condition");

      throw new NotFoundError("Product not found");
    }

    const order = new Order({
      _id: new mongoose.Types.ObjectId(),
      quantity: req.body.quantity,
      product: req.body.productId,
    });

    const result = await order.save();
    console.log(result);

    return res.status(201).json({
      message: "Order saved",
      createdOrder: {
        id: result._id,
        quantity: result.quantity,
        product: result.productId,
      },
    });
  } catch (err) {
    if (err instanceof CastError) {
      throw new ValidationError(err.message);
    }
    throw err;
  }
});

//approachs for data layer : doesn't specify logic that related to only one repository
// user table (one entity) : user repo should operates with only user entity
// look into more scalable app : data mapper approach: models = structure + repository = loigc  , samll apps: active record (pattern) + model describe a basic logic

exports.get_order = (req, res, next) => {
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
};

exports.update_order = (req, res, next) => {
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
};

exports.remove_order = (req, res, next) => {
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
};

// **************************** //
// layered arc. quick look

// this is a decorator: it extends the promise returned by handler to catch any error returned
// using the default error handler in express (which is "next")
// const withAsyncError = (handler) => (req, res, next) =>
//   handler(req, res, next).catch(next);

// exports.orders_post_one_order = withAsyncError(async (req, res, next) => {
//   // throw new Error("failed")
//   console.log("here", req.body.productId);
//   try {
//     const order = await businessLayer.createOrder(...)
//     return res.status(201).json(order)
//   } catch (err) {
//     if (err instanceof ProductNotFoundError) {
//       throw new NotFoundError(err.message);
//     }
//     if (err instanceof OrderAlreadyExists) {
//       throw new ConflictError(err.message)
//     }
//     throw err;
//   }
// });

// const product = await Product.findById(req.body.productId);
//     if (!product) {
//       console.log("inside product condition");

//       throw new ProductNotFoundError("Product not found");
//     }

//     const order = new Order({
//       _id: new mongoose.Types.ObjectId(),
//       quantity: req.body.quantity,
//       product: req.body.productId,
//     });

//     const result = await order.save();
//     console.log(result);

//     return res.status(201).json({
//       message: "Order saved",
//       createdOrder: {
//         id: result._id,
//         quantity: result.quantity,
//         product: result.productId,
//       },
//     });
