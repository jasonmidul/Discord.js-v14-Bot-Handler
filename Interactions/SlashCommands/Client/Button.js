const Command = require("../../../Structures/Classes/BaseCommand");
const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

class Ping extends Command {
  constructor(client) {
    super(client, {
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
  async execute(interaction, client) {
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
