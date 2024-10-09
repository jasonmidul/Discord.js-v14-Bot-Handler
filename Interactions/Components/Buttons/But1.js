const Component = require("../../../Structures/Classes/BaseComponent");
class But1 extends Component {
  constructor(client) {
    super(client, {
      id: "but1",
    });
  }
  async execute(interaction, client) {
    await interaction.reply({ content: "Reply of But1." });
  }
}

module.exports = But1;
