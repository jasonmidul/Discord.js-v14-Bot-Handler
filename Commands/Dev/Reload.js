const Command = require("../../Structures/Classes/BaseCommand");
const { CommandHandler } = require("../../Structures/Handlers/CommandHandler");
const { EventHandler } = require("../../Structures/Handlers/EventHandler");
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

class Reload extends Command {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reload commands/events!")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((subCommand) =>
          subCommand.setName("events").setDescription("Reload all events.")
        )
        .addSubcommand((subCommand) =>
          subCommand
            .setName("commands")
            .setDescription("Reload/register all slash commands.")
            .addStringOption((option) =>
              option
                .setName("deploy-slash")
                .setDescription("By default it's (false)")
                .setRequired(false)
                .addChoices(
                  { name: "true", value: "true" },
                  { name: "false", value: "false" }
                )
            )
        ),
      options: {
        devOnly: true,
      },
    });
  }
  async execute(interaction, client) {
    const subCmd = interaction.options.getSubcommand();
    switch (subCmd) {
      case "commands":
        try {
          const isDeploySlash =
            interaction.options.getString("deploy-slash") || false;
          const { loadCommands } = new CommandHandler();
          await loadCommands(client, isDeploySlash);
          interaction.reply({
            content: `All commands has been reloaded. \nAnd deploy slash was \`${isDeploySlash}\``,
            ephemeral: true,
          });
        } catch (error) {
          console.log(error);
        }
        break;
      case "events":
        try {
          for (const [key, value] of client.events)
            client.removeListener(key, value);
          const { loadEvents } = new EventHandler();
          await loadEvents(client);
          interaction.reply({
            content: `All events has been reloaded.`,
            ephemeral: true,
          });
        } catch (error) {
          console.log(error);
        }
      default:
        break;
    }
  }
}

module.exports = Reload;
