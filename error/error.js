const { validate } = require("../api/models/product");

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

exports.ValidationError = ValidationError;
