const Event = require("../../Structures/Classes/BaseEvent");
const { Events } = require("discord.js");
const { languageDatas } = require("../../Schemas/index");
const { t } = require("i18next");

class ButtonCreate extends Event {
  constructor(client) {
    super(client, {
      name: Events.InteractionCreate,
    });
  }
  /**
   *
   * @param {import("discord.js").ButtonInteraction} interaction
   */
  async execute(interaction) {
    const { client } = this;
    if (!interaction.isButton()) return;
    const button = client.buttons.get(interaction.customId);
    if (!button) return;
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
      await button.execute(interaction, client, lng);
    } catch (error) {
      client.logger.error(error);
      if (interaction.replied) {
        await interaction.editReply({
          content: t("event.button.fail", { lng }),
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: t("event.button.fail", { lng }),
          ephemeral: true,
        });
      }
    }
  }
}

module.exports = ButtonCreate;
