const Component = require("../../../Structures/Classes/BaseComponent");
class But1 extends Component {
  constructor(client) {
    super(client, {
      id: "but1",
    });
  }
  /**
   *
   * @param {import("discord.js").ButtonInteraction} interaction
   */
  async execute(interaction) {
    await interaction.reply({ content: "Reply of But1." });
  }
}

module.exports = But1;
