const mongoose = require("mongoose");
const botDatas = require("./Bot/BotDatas");
const premiumDatas = require("./Server/PremiumDatas");
const languageDatas = require("./Server/LanguageData");
const redeemCodes = require("./Bot/RedeemCode");

/**
 *
 * @param {import("../Structures/Classes/BotClient").BotClient} client
 */

function ConnectMongo(client) {
  if (client.config.mongoUrl) {
    client.logger.info("Trying to connect with database...");
    mongoose.set("strictQuery", false);
    mongoose
      .connect(client.config.mongoUrl)
      .then((data) => {
        client.logger.success(
          `Database has been connected to: "${data.connection.name}"`
        );
      })
      .catch((err) => client.logger.error(err));
  } else client.logger.warn(`You forget to add mongoUrl in config.js`);
}

module.exports = {
  ConnectMongo,
  botDatas,
  premiumDatas,
  redeemCodes,
  languageDatas,
};
