const mongoose = require("mongoose");

const botDatas = require("./Bot/BotDatas");

function ConnectMongo(client) {
  if (client.config.mongoUrl) {
    console.log("Trying to connect with database...");
    mongoose.set("strictQuery", false);
    mongoose
      .connect(client.config.mongoUrl)
      .then((data) => {
        console.log(
          `Database has been connected to: "${data.connection.name}"`
        );
      })
      .catch((err) => console.log(err));
  } else console.log(`You forget to add mongoUrl in config.js`);
}

module.exports = { ConnectMongo, botDatas };
