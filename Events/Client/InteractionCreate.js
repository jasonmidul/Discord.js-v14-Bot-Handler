const Event = require("../../Structures/Classes/BaseEvent");
const { jsonFind } = require("../../Structures/Functions/index");
const { Events, CommandInteraction, InteractionType } = require("discord.js");

class InteractionCreate extends Event {
  constructor(client) {
    super(client, {
      name: Events.InteractionCreate,
    });
  }

  async execute(interaction) {
    const { client } = this;
    if (
      interaction instanceof CommandInteraction &&
      interaction.type === InteractionType.ApplicationCommand
    ) {
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) return;

      if (
        command.options.devOnly &&
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

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.log(error);
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
}

module.exports = InteractionCreate;
