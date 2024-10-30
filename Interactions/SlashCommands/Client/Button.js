const Command = require("../../../Structures/Classes/BaseCommand");
const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

class Ping extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName("button")
        .setDescription("Get the button.")
        .setDMPermission(false),
      options: {
        //  premium: true,
        //  devOnly: false,
      },
    });
  }
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const confirm = new ButtonBuilder()
      .setCustomId("but1")
      .setLabel("But1")
      .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
      .setCustomId("but2")
      .setLabel("But2")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(cancel, confirm);
    interaction.reply({ content: "Here is your button!", components: [row] });
  }
}

module.exports = Ping;
