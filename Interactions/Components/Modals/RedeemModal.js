const Component = require("../../../Structures/Classes/BaseComponent");
const { EmbedBuilder, Colors } = require("discord.js");
const { t } = require("i18next");

class Redeem extends Component {
  constructor(client) {
    super(client, {
      id: "redeem-modal",
    });
  }
  /**
   *
   * @param {import("discord.js").ModalSubmitInteraction} interaction
   * @param {import("../../../Structures/Classes/BotClient").BotClient} client
   * @param {string} lng
   */
  async execute(interaction, client, lng) {
    const code = interaction.fields.getTextInputValue("code");
    const redeemCode = await client.db.redeemCodes.findOne({
      code: code,
    });

    if (!redeemCode) {
      return await interaction.reply({
        content: t("component:modal.redeemModal.validCode", { lng }),
        ephemeral: true,
      });
    }
    if (redeemCode.for == "user") {
      if (interaction.guildId !== null)
        return interaction.reply({
          content: t("component:modal.redeemModal.errUserCode", { lng }),
          ephemeral: true,
        });
      const userPremiumData = await client.db.userPremiumDatas.findOne({
        userId: interaction.user.id,
      });

      if (userPremiumData) {
        return await interaction.reply({
          content: t("component:modal.redeemModal.userPremiumExist", { lng }),
          ephemeral: true,
        });
      } else {
        await client.db.userPremiumDatas.create({
          userId: interaction.user.id,
          userName: interaction.user.username,
          codeBy: redeemCode.by,
          duration: redeemCode.duration,
          redeemAt: Date.now(),
        });
        const embed = new EmbedBuilder().setColor(Colors.Purple).setDescription(
          t("component:modal.redeemModal.userSuccess", {
            lng,
            duration: parseInt(`${(Date.now() + redeemCode.duration) / 1000}`),
          })
        );
        await interaction.reply({ embeds: [embed] });
        await client.db.redeemCodes.findOneAndDelete({
          code: code,
        });
      }
      // if guild
    } else {
      if (interaction.guildId == null)
        return interaction.reply({
          content: t("component:modal.redeemModal.errGuildCode", { lng }),
          ephemeral: true,
        });
      const premiumData = await client.db.premiumDatas.findOne({
        guildId: interaction.guildId,
      });

      if (premiumData) {
        return await interaction.reply({
          content: t("component:modal.redeemModal.guildPremiumExist", { lng }),
          ephemeral: true,
        });
      } else {
        await client.db.premiumDatas.create({
          guildId: interaction.guildId,
          guildName: interaction.guild.name,
          by: interaction.user.id,
          codeBy: redeemCode.by,
          duration: redeemCode.duration,
          redeemAt: Date.now(),
        });
        const embed = new EmbedBuilder().setColor(Colors.Purple).setDescription(
          t("component:modal.redeemModal.guildSuccess", {
            lng,
            duration: parseInt(`${(Date.now() + redeemCode.duration) / 1000}`),
          })
        );
        await client.db.redeemCodes.findOneAndDelete({
          code: code,
        });
        await interaction.reply({ embeds: [embed] });
      }
    }
  }
}

module.exports = Redeem;
