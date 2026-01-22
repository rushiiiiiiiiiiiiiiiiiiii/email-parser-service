const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  received_at: {
    type: Date,
    required: true
  },
  parsed_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Email", emailSchema);
