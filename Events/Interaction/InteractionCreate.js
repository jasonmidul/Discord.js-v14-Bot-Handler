const Event = require("../../Structures/Classes/BaseEvent");
const { jsonFind, Logger } = require("../../Structures/Functions/index");
const {
  premiumDatas,
  userPremiumDatas,
  languageDatas,
} = require("../../Schemas/index.js");
const { Events, InteractionType } = require("discord.js");
const logger = new Logger();
const { t } = require("i18next");

class InteractionCreate extends Event {
  constructor(client) {
    super(client, {
      name: Events.InteractionCreate,
    });
  }
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { client } = this;
    if (interaction.type !== InteractionType.ApplicationCommand) return;

    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;
    let languageData = await languageDatas.findOne({
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

    if (
      command.options?.devOnly &&
      !jsonFind(interaction.user.id, client.config.developers)
    ) {
      return await interaction.reply({
        content: t("event.command.devOnly", {
          lng,
          client: client.user.username,
        }),
        ephemeral: true,
      });
    }

    if (
      client.config.underDevelopment &&
      !jsonFind(interaction.guild, client.config.devGuilds) &&
      !jsonFind(interaction.guild, client.config.betaTestGuilds)
    ) {
      return await interaction.reply({
        content: t("event.command.underDev", { lng }),
        ephemeral: true,
      });
    }
    if (command.options?.premiumUser) {
      const premiumData = await userPremiumDatas.findOne({
        userId: interaction.user.id,
      });
      if (!premiumData) {
        return interaction.reply({
          content: t("event.command.userPremium", { lng }),
          ephemeral: true,
        });
      }
      if (premiumData.redeemAt + premiumData.duration <= Date.now()) {
        interaction.reply({
          content: t("event.command.userPremiumEnd", {
            lng,
            duration: parseInt(
              `${(premiumData.redeemAt + premiumData.duration) / 1000}`
            ),
          }),
        });
        return await userPremiumDatas.findOneAndDelete({
          userId: interaction.user.id,
        });
      }
    }
    if (command.options?.premiumGuild) {
      const premiumData = await premiumDatas.findOne({
        guildId: interaction.guildId,
      });
      if (!premiumData) {
        return interaction.reply({
          content: t("event.command.guildPremium", { lng }),
          ephemeral: true,
        });
      }
      if (premiumData.redeemAt + premiumData.duration <= Date.now()) {
        interaction.reply({
          content: t("event.command.guildPremiumEnd", {
            lng,
            duration: parseInt(
              `${(premiumData.redeemAt + premiumData.duration) / 1000}`
            ),
          }),
        });
        return await premiumDatas.findOneAndDelete({
          guildId: interaction.guildId,
        });
      }
    }

    try {
      await command.execute(interaction, client, lng);
    } catch (error) {
      logger.error(error);
      if (interaction.replied) {
        await interaction.editReply({
          content: t("event.command.fail", { lng }),
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: t("event.command.fail", { lng }),
          ephemeral: true,
        });
      }
    }
  }
}

module.exports = InteractionCreate;
