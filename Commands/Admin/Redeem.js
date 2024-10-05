const RedeemCode = require("../../Schemas/Server/RedeemCode");
const Command = require("../../Structures/Classes/BaseCommand");
const { premiumDatas, redeemCodes } = require("../../Schemas/index");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  Colors,
  PermissionFlagsBits,
} = require("discord.js");
const ms = require("ms");

class Redeem extends Command {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("redeem")
        .setDescription("To redeem premium code!")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
          option
            .setName("code")
            .setDescription("Paste your redeem code here!")
            .setRequired(true)
        ),
    });
  }
  async execute(interaction, client) {
    const premiumData = await premiumDatas.findOne({
      guildId: interaction.guildId,
    });

    if (premiumData) {
      return await interaction.reply({
        content: `> You can't redeem here, this server is already in premium list.`,
        ephemeral: true,
      });
    }
    const code = interaction.options.getString("code");

    const redeemCode = await redeemCodes.findOne({
      code: code,
    });

    if (!redeemCode) {
      return await interaction.reply({
        content: `> Please enter a valid redeem code.`,
        ephemeral: true,
      });
    } else {
      await premiumDatas.create({
        guildId: interaction.guildId,
        guildName: interaction.guild.name,
        by: interaction.user.id,
        codeBy: redeemCode.by,
        duration: redeemCode.duration,
        redeemAt: Date.now(),
      });

      const embed = new EmbedBuilder()
        .setColor(Colors.Purple)
        .setDescription(
          `This server is a premium server from today and it will expire <t:${parseInt(
            `${(Date.now() + redeemCode.duration) / 1000}`
          )}:R>`
        );
      await interaction.reply({ embeds: [embed] });
      await redeemCodes.findOneAndDelete({
        code: code,
      });
    }
  }
}

module.exports = Redeem;
