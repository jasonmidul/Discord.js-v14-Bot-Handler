const Component = require("../../../Structures/Classes/BaseComponent");
class Delete extends Component {
  constructor(client) {
    super(client, {
      id: "delete",
    });
  }
  /**
   *
   * @param {import("discord.js").ButtonInteraction} interaction
   */
  async execute(interaction) {
    interaction.channel.messages.delete(interaction.message.id);
  }
}
module.exports = Delete;
