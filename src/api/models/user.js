const mongoose = require("mongoose");

// the unique config in the email doesn't mean we get validation
// it's only for indexation purposes knowing that only one email should exist with that string
// means it doesn't save us from verifying the uniquness of the key once inserting with /signup endpoint
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
