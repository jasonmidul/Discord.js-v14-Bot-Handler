const { Schema, model } = require("mongoose");

const codeSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  by: {
    type: String,
    required: true,
  },
});

module.exports = model("RedeemCodes", codeSchema);
