const { Schema, model } = require("mongoose");

const premiumSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  guildName: {
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
  by: {
    type: String,
    required: true,
  },
});

module.exports = model("PremiumDatas", premiumSchema);
