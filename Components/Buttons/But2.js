const Component = require("../../Structures/Classes/BaseComponent");
class But2 extends Component {
  constructor(client) {
    super(client, {
      id: "but2",
    });
  }
  async execute(interaction, client) {
    await interaction.reply({ content: "Reply of But2." });
  }
}

module.exports = But2;
