const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  botToken: process.env.token,
  mongoUrl: process.env.mongoUrl,
  clientId: process.env.clientId,
  logChannel: process.env.logChannel,
  deploySlashOnReady: true,
  underDevelopment: false,
  developers: [
    {
      name: "Jason Midul",
      id: "948807824446742568",
    },
    {
      name: "theassassin0128",
      id: "720186844540567583",
    },
  ],
  devGuilds: [
    {
      name: "Test Electro",
      id: "1096824161403420726",
    },
    {
      name: "Hopeless Fellows",
      id: "1054284394791178291",
    },
  ],
  betaTestGuilds: [
    {
      name: "Chapry Academy",
      id: "1280838788591124541",
    },
  ],
  logWebhook: process.env.logWebhook,
};
