const Command = require("../../Structures/Classes/BaseCommand");
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

class Eval extends Command {
  constructor(client) {
    super(client, {
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
        ),
      options: {
        devOnly: true,
      },
    });
  }
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

      const cleaned = await clean(client, evaled);

      interaction.reply({
        content: `\`\`\`js\n${cleaned}\n\`\`\``,
        ephemeral: true,
      });
    } catch (err) {
      interaction.reply({
        content: `\`ERROR\` \n\`\`\`xl\n${err}\n\`\`\``,
        ephemeral: true,
      });
    }
  }
}

module.exports = Eval;
