const Command = require("../../Structures/Classes/BaseCommand");
const { CommandHandler } = require("../../Structures/Handlers/CommandHandler");
const { EventHandler } = require("../../Structures/Handlers/EventHandler");
const { premiumDatas, redeemCodes } = require("../../Schemas/index");
const { genCode } = require("../../Structures/Functions/index");
const ms = require("ms");
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
            .addStringOption((option) =>
              option
                .setName("duration")
                .setDescription(
                  "Set a duration. (example: 7days, 1month/default: 30days)"
                )
                .setRequired(true)
                .addChoices(
                  { name: "Weekly", value: "1 week" },
                  { name: "Monthly", value: "30 day" },
                  { name: "Half Yearly", value: "182.5 day" },
                  { name: "Yearly", value: "365 day" },
                  { name: "Life Time", value: "18250 day" }
                )
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
        )
        .addSubcommand((subCommand) =>
          subCommand
            .setName("code-gen")
            .setDescription("To generate a redeem codee!")
            .addStringOption((option) =>
              option
                .setName("duration")
                .setDescription("Set a duration.")
                .setRequired(true)
                .addChoices(
                  { name: "Weekly", value: "1 week" },
                  { name: "Monthly", value: "30 day" },
                  { name: "Half Yearly", value: "182.5 day" },
                  { name: "Yearly", value: "365 day" },
                  { name: "Life Time", value: "18250 day" }
                )
            )
        )
        .addSubcommand((subCommand) =>
          subCommand
            .setName("code-remove")
            .setDescription("Remove a premium code!")
            .addStringOption((option) =>
              option
                .setName("code")
                .setDescription("Which code you want to remove from code list.")
                .setRequired(true)
            )
        )
        .addSubcommand((subCommand) =>
          subCommand
            .setName("code-list")
            .setDescription("See the list of premium codes")
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
    const duration = interaction.options.getString("duration") || "30 days";
    const guildId = interaction.options.getString("server-id");
    const rmvCode = interaction.options.getString("code");

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
            by: interaction.user.id,
            codeBy: interaction.user.id,
            duration: ms(duration),
            redeemAt: Date.now(),
          });
          await interaction.reply({
            content: `> \`${guild.id}\`**(${
              guild.name
            })** sucessfully added to premium till <t:${parseInt(
              `${(Date.now() + ms(duration)) / 1000}`
            )}:R>.`,
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
      case "code-gen":
        const code = genCode();
        const redeemCode = await redeemCodes.findOne({
          code: code,
        });

        if (!redeemCode) {
          await redeemCodes.create({
            code: code,
            duration: ms(duration),
            by: interaction.user.id,
          });
          await interaction.reply({
            content: `> Here is your code for <t:${parseInt(
              `${(Date.now() + ms(duration)) / 1000}`
            )}:R> \`\`\`${code}\`\`\``,
            ephemeral: true,
          });
        } else {
          redeemCode.duration = ms(duration);
          redeemCode.save();
          await interaction.reply({
            content: `> Here is your code for <t:${parseInt(
              `${(Date.now() + ms(duration)) / 1000}`
            )}:R> \`\`\`${code}\`\`\``,
            ephemeral: true,
          });
        }

        break;
      case "code-remove":
        const remove_codeData = await redeemCodes.findOne({
          code: rmvCode,
        });

        if (remove_codeData) {
          await redeemCodes.findOneAndDelete({
            code: rmvCode,
          });
          await interaction.reply({
            content: `> \`${rmvCode}\` sucessfully removed from premium code.`,
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: `> Please enter a valid redeem code.`,
            ephemeral: true,
          });
        }
        break;
      case "code-list":
        const _page = interaction.options.getNumber("page") || 1;
        const _redeemCode = await redeemCodes.find();
        const embed2 = new EmbedBuilder()
          .setTitle("code list")
          .setColor(Colors.Purple)
          .setTimestamp();

        const _pageNum = 10 * _page - 10;
        if (_redeemCode.length < _pageNum) {
          return await interaction.reply({
            content: `> Unable to find page no \`${_page}\`.`,
            ephemeral: true,
          });
        }
        if (_redeemCode.length >= 11) {
          embed2.setFooter({
            text: `page ${_page} of ${Math.ceil(_redeemCode.length / 10)}`,
          });
        }

        for (const code of _redeemCode.splice(_pageNum, 10)) {
          embed2.addFields({
            name: `${code.by}`,
            value: `> expire <t:${parseInt(
              `${(Date.now() + code.duration) / 1000}`
            )}:R> \n\`\`\`${code.code}\`\`\``,
          });
        }

        await interaction.reply({ embeds: [embed2] });
        break;
      default:
        break;
    }
  }
}

module.exports = Premium;
