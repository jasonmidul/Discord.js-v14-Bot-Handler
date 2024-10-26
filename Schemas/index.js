const mongoose = require("mongoose");
const botDatas = require("./Bot/BotDatas");
const premiumDatas = require("./Server/PremiumDatas");
const languageDatas = require("./Server/LanguageData");
const redeemCodes = require("./Bot/RedeemCode");
const userPremiumDatas = require("./User/UserPremium");
const { Logger } = require("../Structures/Functions/index");
const logger = new Logger();
/**
 *
 * @param {import("../Structures/Classes/BotClient").BotClient} client
 */

function ConnectMongo(client) {
  if (client.config.mongoUrl) {
    logger.info("Trying to connect with database...");
    mongoose.set("strictQuery", false);
    mongoose
      .connect(client.config.mongoUrl)
      .then((data) => {
        logger.success(
          `Database has been connected to: "${data.connection.name}"`
        );
      })
      .catch((err) => logger.error(err));
  } else logger.warn(`You forget to add mongoUrl in config.js`);
}

module.exports = {
  ConnectMongo,
  botDatas,
  premiumDatas,
  redeemCodes,
  userPremiumDatas,
  languageDatas,
};
