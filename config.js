const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  botToken: process.env.token,
  mongoUrl: process.env.mongoUrl,
  clientId: "1106236979147964426",
  logChannel: "1096824161403420729",
  deploySlashOnReady: true,
  underDevelopment: false,
  developers: [
    {
      name: "Jason Midul",
      id: "948807824446742568",
    },
  ],
  devGuilds: [
    {
      name: "Test Electro",
      id: "1096824161403420726",
    },
  ],
  betaTestGuilds: [
    {
      name: "Chapry Academy",
      id: "1280838788591124541",
    },
  ],
  logWebhook:
    "https://discord.com/api/webhooks/1292056459563237436/PaLJOQ2AJLG39b9ovIJ0_IFaw3HxJbrPYYwmfj5HHmy3Cy9rNdkhaIuuv7pk_Ts4M_q1",
};
