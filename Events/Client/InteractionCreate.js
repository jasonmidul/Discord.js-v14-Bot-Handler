const Event = require("../../Structures/Classes/BaseEvent");
const { jsonFind, Logger } = require("../../Structures/Functions/index");
const { premiumDatas, userPremiumDatas } = require("../../Schemas/index.js");
const { Events, InteractionType } = require("discord.js");
const logger = new Logger();

class InteractionCreate extends Event {
  constructor(client) {
    super(client, {
      name: Events.InteractionCreate,
    });
  }

  async execute(interaction) {
    const { client } = this;
    if (interaction.type !== InteractionType.ApplicationCommand) return;

    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;

    if (
      command.options?.devOnly &&
      !jsonFind(interaction.user.id, client.config.developers)
    ) {
      return await interaction.reply({
        content: `> You can not use this command. Only ${client.user.username}\`s developer can use this command.`,
        ephemeral: true,
      });
    }

    if (
      client.config.underDevelopment &&
      !jsonFind(interaction.guild, client.config.devGuilds) &&
      !jsonFind(interaction.guild, client.config.betaTestGuilds)
    ) {
      return await interaction.reply({
        content: "> This bot is under development please try again later",
        ephemeral: true,
      });
    }
    if (command.options?.premiumUser) {
      const premiumData = await userPremiumDatas.findOne({
        userId: interaction.user.id,
      });
      if (!premiumData) {
        return interaction.reply({
          content:
            "> You can't use this command only premium users can use this command.",
          ephemeral: true,
        });
      }
      if (premiumData.redeemAt + premiumData.duration >= Date.now()) {
        interaction.reply({
          content: `> You can use premium command because, your premium session has expired <t:${parseInt(
            `${(Date.now() + redeemCode.duration) / 1000}`
          )}:R>.`,
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
          content: "> You can use this command only in premium server.",
          ephemeral: true,
        });
      }
      if (premiumData.redeemAt + premiumData.duration >= Date.now()) {
        interaction.reply({
          content: `> You can use premium command because, this servers ptrmium session has expired <t:${parseInt(
            `${(Date.now() + redeemCode.duration) / 1000}`
          )}:R>.`,
        });
        return await premiumDatas.findOneAndDelete({
          guildId: interaction.guildId,
        });
      }
    }

    try {
      await command.execute(interaction, client);
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

module.exports = InteractionCreate;
