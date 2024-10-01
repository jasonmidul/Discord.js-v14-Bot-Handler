const { Client, Collection } = require("discord.js");
const { EventHandler } = require("../Handlers/EventHandler");
const Config = require("../../config");

class BotClient extends Client {
  constructor(options) {
    super(options);

    this.config = Config;
    this.events = new Collection();
    this.slashCommands = new Collection();
  }
  async start() {
    await this.registerModules();
    await this.login(this.config.botToken);
  }
  async registerModules() {
    const { loadEvents } = new EventHandler();

    try {
      await loadEvents(this);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = { BotClient };
