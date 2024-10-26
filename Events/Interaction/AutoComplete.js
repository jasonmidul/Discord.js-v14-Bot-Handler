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
  /**
   *
   * @param {import("discord.js").AutocompleteInteraction} interaction
   */
  async execute(interaction) {
    const { client } = this;
    if (!interaction.isAutocomplete()) return;
    const autoComplete = client.autoComplete.get(interaction.commandName);
    if (!autoComplete) return;
    const languageData = await languageDatas.findOne({
      guildId: interaction.guildId,
    });
    if (!languageData && interaction.guildId !== null) {
      await languageDatas.create({
        guildId: interaction.guildId,
        lng: "en",
      });
      languageData = await languageDatas.findOne({
        guildId: interaction.guildId,
      });
    }
    const lng = interaction.guildId == null ? "en" : languageData.lng;

    try {
      await autoComplete.execute(interaction, client, lng);
    } catch (error) {
      logger.error(error);
    }
  }
}

module.exports = AutoComplete;
