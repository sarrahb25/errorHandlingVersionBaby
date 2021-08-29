const { ValidationError, NotFoundError } = require("../../error/error");
const ApiError = require("../../error/ApiError");

function apiErrorHandler(err, req, res, next) {
  // no logging on prod since it's async
  console.error("Received error:", err);

  if (err instanceof ApiError) {
    res.status(err.code).json(err.message);
    return;
  }

  if (err instanceof ValidationError) {
    res.status(400).json({
      error: "validation error",
      message: err.message,
    });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).json({
      error: "Not Found error",
      message: err.message,
    });
    return;
  }

  res.status(500).json("something went wrong");
}

module.exports = apiErrorHandler;
