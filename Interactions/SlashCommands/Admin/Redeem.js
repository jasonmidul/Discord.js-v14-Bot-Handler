const Command = require("../../../Structures/Classes/BaseCommand");
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
} = require("discord.js");
const { t } = require("i18next");

class Redeem extends Command {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("redeem")
        .setDescription("To redeem premium code!")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    });
  }
  async execute(interaction, client, lng) {
    const modal = new ModalBuilder()
      .setCustomId("redeem-modal")
      .setTitle(t("command:redeem.modal.title", { lng }));

    const codeResiver = new TextInputBuilder()
      .setCustomId("code")
      .setLabel("code")
      .setStyle(TextInputStyle.Short)
      .setMaxLength(8)
      .setPlaceholder(t("command:redeem.modal.placeholder", { lng }))
      .setRequired(true);
    const actionRow = new ActionRowBuilder().addComponents(codeResiver);
    modal.addComponents(actionRow);
    await interaction.showModal(modal);
  }
}

module.exports = Redeem;
