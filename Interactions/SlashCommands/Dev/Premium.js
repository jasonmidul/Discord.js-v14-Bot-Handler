const Command = require("../../../Structures/Classes/BaseCommand");
const { genCode } = require("../../../Structures/Functions/index");
const ms = require("ms");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  Colors,
  PermissionFlagsBits,
  SlashCommandSubcommandGroupBuilder,
} = require("discord.js");

class Premium extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName("premium")
        .setDescription("To add, remove and find server.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((subCommand) =>
          subCommand
            .setName("add-server")
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
            .setName("remove-server")
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
            .setName("list-server")
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
            .setName("add-user")
            .setDescription("Add a premium user!")
            .addStringOption((option) =>
              option
                .setName("user-id")
                .setDescription("Which user you want to set as premium")
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
            .setName("remove-user")
            .setDescription("Remove a premium user!")
            .addStringOption((option) =>
              option
                .setName("user-id")
                .setDescription("Which user you want to remove from premium")
                .setRequired(true)
            )
        )
        .addSubcommand((subCommand) =>
          subCommand
            .setName("list-user")
            .setDescription("See the list of premium users")
            .addNumberOption((num) => {
              return num
                .setName("page")
                .setRequired(false)
                .setDescription("Select a page to view");
            })
        )
        .addSubcommand((subCommand) =>
          subCommand
            .setName("generate")
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
            .addStringOption((option) =>
              option
                .setName("for")
                .setDescription("The redeem code for server or user")
                .setRequired(true)
                .addChoices(
                  { name: "Server", value: "guild" },
                  { name: "User", value: "user" }
                )
            )
        )
        .addSubcommand((subCommand) =>
          subCommand
            .setName("remove-code")
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
            .setName("list-code")
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
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../../Structures/Classes/BotClient").BotClient} client
   */
  async execute(interaction, client) {
    const subCmd = interaction.options.getSubcommand();
    const duration = interaction.options.getString("duration") || "30 days";
    const gId = interaction.options.getString("server-id");
    const uId = interaction.options.getString("user-id");
    const rmvCode = interaction.options.getString("code");
    const _for = interaction.options.getString("for");

    let guild;
    let user;
    if (uId) {
      user = await client.users.fetch(uId);
      if (!user)
        return await interaction.reply({
          content: "> I could not locate this user.",
          ephemeral: true,
        });
    }
    if (gId) {
      guild = await client.guilds.cache.get(gId);
      if (!guild)
        return await interaction.reply({
          content: "> I could not locate this server.",
          ephemeral: true,
        });
    }
    switch (subCmd) {
      case "add-server":
        const add_premiumData = await client.db.premiumDatas.findOne({
          guildId: guild.id,
        });

        if (!add_premiumData) {
          await client.db.premiumDatas.create({
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
            })** sucessfully added to premium server till <t:${parseInt(
              `${(Date.now() + ms(duration)) / 1000}`
            )}:R>.`,
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: `> \`${guild.id}\`**(${guild.name})**  already in premium server.`,
            ephemeral: true,
          });
        }

        break;
      case "remove-server":
        const remove_premiumData = await client.db.premiumDatas.findOne({
          guildId: guild.id,
        });

        if (remove_premiumData) {
          await client.db.premiumDatas.findOneAndDelete({
            guildId: guild.id,
          });
          await interaction.reply({
            content: `> \`${guild.id}\`**(${guild.name})** sucessfully removed from premium server.`,
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: `> \`${guild.id}\`**(${guild.name})**  is no a premium server.`,
            ephemeral: true,
          });
        }
        break;
      case "list-server":
        const page = interaction.options.getNumber("page") || 1;
        const premiumData = await client.db.premiumDatas.find();
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
            value: `> ${server.guildId} expire <t:${parseInt(
              `${(server.redeemAt + server.duration) / 1000}`
            )}:R>`,
          });
        }

        return await interaction.reply({ embeds: [embed] });
      case "add-user":
        const userPremiumData = await client.db.userPremiumDatas.findOne({
          userId: user.id,
        });

        if (!userPremiumData) {
          await client.db.userPremiumDatas.create({
            userId: user.id,
            userName: user.username,
            codeBy: interaction.user.id,
            duration: ms(duration),
            redeemAt: Date.now(),
          });
          await interaction.reply({
            content: `> \`${user.id}\`**(${
              user.username
            })** sucessfully added to premium user till <t:${parseInt(
              `${(Date.now() + ms(duration)) / 1000}`
            )}:R>.`,
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: `> \`${user.id}\`**(${user.username})**  already in premium user.`,
            ephemeral: true,
          });
        }

        break;
      case "remove-user":
        const _userPremiumData = await client.db.userPremiumDatas.findOne({
          userId: user.id,
        });

        if (_userPremiumData) {
          await client.db.userPremiumDatas.findOneAndDelete({
            userId: user.id,
          });
          await interaction.reply({
            content: `> \`${user.id}\`**(${user.username})** sucessfully removed from premium user.`,
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: `> \`${user.id}\`**(${user.username})**  is no a premium user.`,
            ephemeral: true,
          });
        }
        break;
      case "list-user":
        const u_page = interaction.options.getNumber("page") || 1;
        const u_premiumData = await client.db.userPremiumDatas.find();
        const embed3 = new EmbedBuilder()
          .setTitle("Premium user list")
          .setColor(Colors.Green)
          .setTimestamp();

        const upageNum = 10 * u_page - 10;
        if (u_premiumData.length < upageNum) {
          return await interaction.reply({
            content: `> Unable to find page no \`${u_page}\`.`,
            ephemeral: true,
          });
        }
        if (u_premiumData.length >= 11) {
          embed.setFooter({
            text: `page ${u_page} of ${Math.ceil(u_premiumData.length / 10)}`,
          });
        }

        for (const user of u_premiumData.splice(upageNum, 10)) {
          embed3.addFields({
            name: `${user.userName}`,
            value: `> ${user.userId} expire <t:${parseInt(
              `${(user.redeemAt + user.duration) / 1000}`
            )}:R>`,
          });
        }

        return await interaction.reply({ embeds: [embed3] });
      case "generate":
        const code = genCode();
        const redeemCode = await client.db.redeemCodes.findOne({
          code: code,
        });

        if (!redeemCode) {
          await client.db.redeemCodes.create({
            code: code,
            duration: ms(duration),
            by: interaction.user.id,
            for: _for,
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
      case "remove-code":
        const remove_codeData = await client.db.redeemCodes.findOne({
          code: rmvCode,
        });

        if (remove_codeData) {
          await client.db.redeemCodes.findOneAndDelete({
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
      case "list-code":
        const _page = interaction.options.getNumber("page") || 1;
        const _redeemCode = await client.db.redeemCodes.find();
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
