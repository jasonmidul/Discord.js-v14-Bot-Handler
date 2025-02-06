const { GatewayIntentBits, Partials } = require("discord.js");
const { BotClient } = require("./Structures/Classes/BotClient");
const {
  ErrorHandler,
  ClientErrorHandler,
} = require("./Structures/Handlers/ErrorHandler");
const { ClusterClient, getInfo } = require("discord-hybrid-sharding");

const client = new BotClient({
  allowedMentions: {
    parse: ["users", "roles", "everyone"],
    repliedUser: false,
  },
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
  partials: [Partials.Channel, Partials.User, Partials.GuildMember],
  shards: ClusterClient.getInfo().SHARD_LIST,
  shardCount: ClusterClient.getInfo().TOTAL_SHARDS,
});
client.cluster = new ClusterClient(client);

ErrorHandler(client);
ClientErrorHandler(client);

client.start();
