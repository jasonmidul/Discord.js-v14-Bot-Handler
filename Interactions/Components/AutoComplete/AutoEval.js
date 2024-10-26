const Component = require("../../../Structures/Classes/BaseComponent");
class AutoEval extends Component {
  constructor(client) {
    super(client, {
      id: "eval",
    });
  }
  /**
   *
   * @param {import("discord.js").AutocompleteInteraction} interaction
   */
  async execute(interaction) {
    const focusedValue = interaction.options.getFocused();
    const choices = [
      { name: "client", value: "client" },
      { name: "interaction", value: "interaction" },
      { name: "client.user", value: "client.user" },
      { name: "interaction.user", value: "interaction.user" },
      { name: "client.application", value: "client.application" },
      {
        name: "client.application.commands.fetch()",
        value: "client.application.commands.fetch()",
      },
      {
        name: "interaction.guild.commands.fetch()",
        value: "interaction.guild.commands.fetch()",
      },
      { name: "interaction.guild", value: "interaction.guild" },
    ];

    const filtered = choices.filter((choice) =>
      choice.name.startsWith(focusedValue)
    );
    await interaction.respond(filtered.map((choice) => choice));
  }
}

module.exports = AutoEval;
