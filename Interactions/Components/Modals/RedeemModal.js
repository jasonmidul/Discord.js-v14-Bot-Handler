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
        content: t("component:modal.redeemModal.notValidCode", { lng }),
        ephemeral: true,
      });
    }

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

module.exports = Redeem;
