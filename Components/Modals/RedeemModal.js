const Component = require("../../Structures/Classes/BaseComponent");
const {
  premiumDatas,
  redeemCodes,
  userPremiumDatas,
} = require("../../Schemas/index");
const { EmbedBuilder, Colors } = require("discord.js");

class Redeem extends Component {
  constructor(client) {
    super(client, {
      id: "redeem-modal",
    });
  }
  async execute(interaction, client) {
    const code = interaction.fields.getTextInputValue("code");
    const redeemCode = await redeemCodes.findOne({
      code: code,
    });

    if (!redeemCode) {
      return await interaction.reply({
        content: `> Please enter a valid redeem code.`,
        ephemeral: true,
      });
    }
    if (redeemCode.for == "user") {
      if (interaction.guildId !== null)
        return interaction.reply({
          content: `> You can't redeem premium user code in server, try \`/redeem\` in my DM to redeem user premium code.`,
          ephemeral: true,
        });
      const userPremiumData = await userPremiumDatas.findOne({
        userId: interaction.user.id,
      });

      if (userPremiumData) {
        return await interaction.reply({
          content: `> You can't redeem premium code, you are already in premium list.`,
          ephemeral: true,
        });
      } else {
        await userPremiumDatas.create({
          userId: interaction.user.id,
          userName: interaction.user.username,
          codeBy: redeemCode.by,
          duration: redeemCode.duration,
          redeemAt: Date.now(),
        });
        const embed = new EmbedBuilder()
          .setColor(Colors.Purple)
          .setDescription(
            `You are a premium user from today and it will expire <t:${parseInt(
              `${(Date.now() + redeemCode.duration) / 1000}`
            )}:R>`
          );
        await interaction.reply({ embeds: [embed] });
        await redeemCodes.findOneAndDelete({
          code: code,
        });
      }
      // if guild
    } else {
      if (interaction.guildId == null)
        return interaction.reply({
          content: `> You can't redeem premium server code in DM, try \`/redeem\` in server to redeem server premium code. (Administrator permission required)`,
          ephemeral: true,
        });
      const premiumData = await premiumDatas.findOne({
        guildId: interaction.guildId,
      });

      if (premiumData) {
        return await interaction.reply({
          content: `> You can't redeem here, this server is already in premium list.`,
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
}

module.exports = Redeem;
