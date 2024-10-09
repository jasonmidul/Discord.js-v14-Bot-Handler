const Event = require("../../Structures/Classes/BaseEvent");
const { Events } = require("discord.js");
const { Logger } = require("../../Structures/Functions/index");
const logger = new Logger();
const { languageDatas } = require("../../Schemas/index");
const { t } = require("i18next");

class ButtonCreate extends Event {
  constructor(client) {
    super(client, {
      name: Events.InteractionCreate,
    });
  }

  async execute(interaction) {
    const { client } = this;
    if (!interaction.isButton()) return;
    const button = client.buttons.get(interaction.customId);
    if (!button) return;
    let lng = "en";
    const languageData = await languageDatas.findOne({
      guildId: interaction.guildId,
    });
    if (languageData) lng = languageData.lng;

    try {
      await button.execute(interaction, client, lng);
    } catch (error) {
      logger.error(error);
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
