const Command = require("../../Structures/Classes/BaseCommand");
const { CommandHandler } = require("../../Structures/Handlers/CommandHandler");
const { EventHandler } = require("../../Structures/Handlers/EventHandler");
const { premiumDatas } = require("../../Schemas/index");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  Colors,
  PermissionFlagsBits,
} = require("discord.js");

class Premium extends Command {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("premium")
        .setDescription("To add, remove and find server.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((subCommand) =>
          subCommand
            .setName("add")
            .setDescription("Add a premium server!")
            .addStringOption((option) =>
              option
                .setName("server-id")
                .setDescription("Which server you want to set as premium")
                .setRequired(true)
            )
        )
        .addSubcommand((subCommand) =>
          subCommand
            .setName("remove")
            .setDescription("Remove a premium server!")
            .addStringOption((option) =>
              option
                .setName("server-id")
                .setDescription("Which server you want to remove from premium")
                .setRequired(true)
            )
        )
        .addSubcommand((subCommand) =>
          subCommand
            .setName("list")
            .setDescription("See the list of premium servers")
            .addNumberOption((num) => {
              return num
                .setName("page")
                .setRequired(false)
                .setDescription("Select a page to view");
            })
        ),
      options: {
        devOnly: true,
      },
    });
  }
  async execute(interaction, client) {
    const subCmd = interaction.options.getSubcommand();
    const guildId = interaction.options.getString("server-id");
    let guild;
    if (guildId) {
      guild = await client.guilds.cache.get(guildId);
      if (!guild)
        return await interaction.reply({
          content: "> I could not locate this server.",
          ephemeral: true,
        });
    }
    switch (subCmd) {
      case "add":
        const add_premiumData = await premiumDatas.findOne({
          guildId: guild.id,
        });

        if (!add_premiumData) {
          await premiumDatas.create({
            guildId: guild.id,
            guildName: guild.name,
          });
          await interaction.reply({
            content: `> \`${guild.id}\`**(${guild.name})** sucessfully added to premium.`,
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: `> \`${guild.id}\`**(${guild.name})**  already in premium.`,
            ephemeral: true,
          });
        }

        break;
      case "remove":
        const remove_premiumData = await premiumDatas.findOne({
          guildId: guild.id,
        });

        if (remove_premiumData) {
          await premiumDatas.findOneAndDelete({
            guildId: guild.id,
          });
          await interaction.reply({
            content: `> \`${guild.id}\`**(${guild.name})** sucessfully removed from premium.`,
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: `> \`${guild.id}\`**(${guild.name})**  is no a premium server.`,
            ephemeral: true,
          });
        }
        break;
      case "list":
        const page = interaction.options.getNumber("page") || 1;
        const premiumData = await premiumDatas.find();
        const embed = new EmbedBuilder()
          .setTitle("Premium server list")
          .setColor(Colors.Green)
          .setTimestamp();

        const pageNum = 10 * page - 10;
        if (premiumData.length < pageNum) {
          return await interaction.reply({
            content: `> Unable to find page no \`${page}\`.`,
            ephemeral: true,
          });
        }
        if (premiumData.length >= 11) {
          embed.setFooter({
            text: `page ${page} of ${Math.ceil(premiumData.length / 10)}`,
          });
        }

        for (const server of premiumData.splice(pageNum, 10)) {
          embed.addFields({
            name: `${server.guildName}`,
            value: `> ${server.guildId}`,
          });
        }

        return await interaction.reply({ embeds: [embed] });

      default:
        break;
    }
  }
}

module.exports = Premium;
