const { GatewayIntentBits, Partials } = require("discord.js");
const { BotClient } = require("./Structures/Classes/BotClient");

const clientOptions = {
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.User],
};

const client = new BotClient(clientOptions);

client.start();
