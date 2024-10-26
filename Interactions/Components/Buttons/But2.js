const Component = require("../../../Structures/Classes/BaseComponent");
class But2 extends Component {
  constructor(client) {
    super(client, {
      id: "but2",
    });
  }
  /**
   *
   * @param {import("discord.js").ButtonInteraction} interaction
   */
  async execute(interaction) {
    await interaction.reply({ content: "Reply of But2." });
  }
}

module.exports = But2;
