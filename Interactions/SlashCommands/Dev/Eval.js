const Command = require("../../../Structures/Classes/BaseCommand");
const {
  SlashCommandBuilder,
  AttachmentBuilder,
  PermissionFlagsBits,
} = require("discord.js");

class Eval extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Eval a code.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
          option
            .setName("code")
            .setDescription("The code you want to eval.")
            .setRequired(true)
            .setAutocomplete(true)
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
    try {
      const code = interaction.options.getString("code");

      const evaled = eval(code);

      async function clean(client, text) {
        if (text && text.constructor.name == "Promise") text = await text;

        if (typeof text !== "string")
          text = require("util").inspect(text, { depth: 1 });

        text = text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
        text = text.replaceAll(client.token, "[REDACTED]");
        return text;
      }

      const reply = await clean(client, evaled);

      if (reply?.length > 1980) {
        const buffer = Buffer.from(reply, "utf8");
        const txtFile = new AttachmentBuilder(buffer, {
          name: `${interaction.user.username}_response.txt`,
        });

        await interaction.reply({
          files: [txtFile],
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: `\`\`\`js\n${reply}\n\`\`\``,
          ephemeral: true,
        });
      }
    } catch (err) {
      interaction.reply({
        content: `\`ERROR\` \n\`\`\`xl\n${err}\n\`\`\``,
        ephemeral: true,
      });
    }
  }
}

module.exports = Eval;
