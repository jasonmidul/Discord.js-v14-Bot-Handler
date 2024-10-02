const { Schema, model } = require("mongoose");

const premiumSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  guildName: {
    type: String,
    default: 1,
  },
});

module.exports = model("PremiumDatas", premiumSchema);
