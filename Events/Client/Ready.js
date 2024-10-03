const Event = require("../../Structures/Classes/BaseEvent");
const { CommandHandler } = require("../../Structures/Handlers/CommandHandler");
const { ConnectMongo } = require("../../Schemas/index");
const { Events, ActivityType, PresenceUpdateStatus } = require("discord.js");
class Ready extends Event {
  constructor(client) {
    super(client, {
      name: Events.ClientReady,
    });
  }

  async execute(client) {
    setInterval(() => {
      const activitys = [
        {
          name: `@jasonmidul`,
          type: ActivityType.Listening,
        },
        {
          name: `Under Development`,
          type: ActivityType.Custom,
        },
      ];
      const activity = activitys[Math.floor(Math.random() * activitys.length)];
      client.user.setActivity(activity);
      client.user.setStatus(PresenceUpdateStatus.Idle);
    }, 5000);

    const { loadCommands } = new CommandHandler();

    try {
      await loadCommands(client, client.config.deploySlashOnReady);
    } catch (error) {
      console.log(error);
    }

    console.log(
      `${client.user.username} is ready in cluster #${client.cluster.id}!`
    );

    try {
      await ConnectMongo(client);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Ready;
