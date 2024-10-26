const { Client, Collection } = require("discord.js");
const { EventHandler } = require("../Handlers/EventHandler");
const { Logger } = require("../Functions/index");
const Datas = require("../../Schemas/index");

class BotClient extends Client {
  /**
   * types defination for discord.js ClientOptions
   * @param {import("discord.js").ClientOptions} options
   */
  constructor(options) {
    super(options);

    // stored data
    this.config = require("../../config");
    this.events = new Collection();
    this.buttons = new Collection();
    this.modals = new Collection();
    this.autoComplete = new Collection();
    this.slashCommands = new Collection();

    //methods
    this.logger = new Logger();
    this.db = Datas;
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
      this.logger.error(error);
    }
  }
}

module.exports = { BotClient };
