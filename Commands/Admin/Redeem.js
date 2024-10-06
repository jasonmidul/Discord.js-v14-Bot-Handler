const Command = require("../../Structures/Classes/BaseCommand");
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
} = require("discord.js");

class Redeem extends Command {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("redeem")
        .setDescription("To redeem premium code!")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    });
  }
  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId("redeem-modal")
      .setTitle("Redeem a premium code");

    const codeResiver = new TextInputBuilder()
      .setCustomId("code")
      .setLabel("code")
      .setStyle(TextInputStyle.Short)
      .setMaxLength(8)
      .setPlaceholder("Enter your code here!")
      .setRequired(true);
    const actionRow = new ActionRowBuilder().addComponents(codeResiver);
    modal.addComponents(actionRow);
    await interaction.showModal(modal);
  }
}

module.exports = Redeem;
