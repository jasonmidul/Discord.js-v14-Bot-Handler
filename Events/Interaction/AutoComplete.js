const Event = require("../../Structures/Classes/BaseEvent");
const { Events } = require("discord.js");
const { Logger } = require("../../Structures/Functions/index");
const logger = new Logger();
const { languageDatas } = require("../../Schemas/index");
const { t } = require("i18next");

class AutoComplete extends Event {
  constructor(client) {
    super(client, {
      name: Events.InteractionCreate,
    });
  }

  async execute(interaction) {
    const { client } = this;
    if (!interaction.isAutocomplete()) return;
    const autoComplete = client.autoComplete.get(interaction.commandName);
    if (!autoComplete) return;
    let lng = "en";
    const languageData = await languageDatas.findOne({
      guildId: interaction.guildId,
    });
    if (languageData) lng = languageData.lng;

    try {
      await autoComplete.execute(interaction, client, lng);
    } catch (error) {
      logger.error(error);
    }
  }
}

module.exports = AutoComplete;
