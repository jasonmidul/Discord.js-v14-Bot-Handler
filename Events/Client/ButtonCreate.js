const Event = require("../../Structures/Classes/BaseEvent");
const { Events } = require("discord.js");
const { Logger } = require("../../Structures/Functions/index");
const logger = new Logger();

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

    try {
      await button.execute(interaction, client);
    } catch (error) {
      logger.error(error);
      if (interaction.replied) {
        await interaction.editReply({
          content: "Catch an error while running this command.",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "Catch an error while running this command.",
          ephemeral: true,
        });
      }
    }
  }
}

module.exports = ButtonCreate;
