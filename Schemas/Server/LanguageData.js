const { Schema, model } = require("mongoose");

const languageData = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  lng: {
    type: String,
    default: "en",
  },
});

module.exports = model("LanguageData", languageData);
