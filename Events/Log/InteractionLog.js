const Event = require("../../Structures/Classes/BaseEvent");
const {
  Events,
  CommandInteraction,
  InteractionType,
  EmbedBuilder,
  Colors,
} = require("discord.js");

class InteractionLog extends Event {
  constructor(client) {
    super(client, {
      name: Events.InteractionCreate,
    });
  }

  async execute(interaction) {
    const { client } = this;
    if (
      interaction instanceof CommandInteraction &&
      interaction.type === InteractionType.ApplicationCommand
    ) {
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) return;

      const channel = await client.channels.cache.get(client.config.logChannel);
      if (interaction.guild === null) return;
      const server = interaction.guild.name;
      const user = interaction.user.username;
      const userId = interaction.user.id;

      const embed = new EmbedBuilder()
        .setColor(Colors.Green)
        .addFields({ name: "User", value: `${user} \`${userId}\`` })
        .addFields({ name: "Command", value: `${interaction}` })
        .addFields({ name: "server id", value: `\`${interaction.guild.id}\`` })
        .setFooter({ text: server })
        .setTimestamp();

      await channel.send({ embeds: [embed] });
    }
  }
}

module.exports = InteractionLog;
