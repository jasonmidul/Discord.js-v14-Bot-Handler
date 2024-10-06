const { Schema, model } = require("mongoose");

const userPremiumSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    default: "undefined",
  },
  duration: {
    type: Number,
    required: true,
  },
  redeemAt: {
    type: Number,
    required: true,
  },
  codeBy: {
    type: String,
    required: true,
  },
});

module.exports = model("UserPremiumDatas", userPremiumSchema);
