const Event = require("../../Structures/Classes/BaseEvent");
const { CommandHandler } = require("../../Structures/Handlers/CommandHandler");
const {
  ComponentHandler,
} = require("../../Structures/Handlers/ComponentHandler");
const { ConnectMongo } = require("../../Schemas/index.js");
const { Events, ActivityType, PresenceUpdateStatus } = require("discord.js");
const { Logger } = require("../../Structures/Functions/index");
const logger = new Logger();

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
    const { loadComponents } = new ComponentHandler();

    try {
      await loadCommands(client, client.config.deploySlashOnReady);
      await loadComponents(client);
    } catch (error) {
      logger.error(error);
    }

    logger.success(`${client.user.username}(#${client.cluster.id}) is ready!`);

    try {
      await ConnectMongo(client);
    } catch (error) {
      logger.error(error);
    }
  }
}

module.exports = Ready;
