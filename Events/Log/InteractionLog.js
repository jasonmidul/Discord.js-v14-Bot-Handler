const Event = require("../../Structures/Classes/BaseEvent");
const { botDatas } = require("../../Schemas/index");
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
      if (interaction.guild === null) return;
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) return;

      const botData = await botDatas.findOne({ password: "jasonmidul" });

      if (!botData) {
        await botDatas.create({ password: "jasonmidul" });
      }
      const cmdsUsed = botData.cmdUsed;
      botData.cmdUsed += 1;
      botData.save();

      const channel = await client.channels.cache.get(client.config.logChannel);
      const server = interaction.guild.name;
      const user = interaction.user.username;
      const userId = interaction.user.id;

      const embed = new EmbedBuilder()
        .setDescription(`${cmdsUsed}th command`)
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
