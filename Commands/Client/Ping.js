const Command = require("../../Structures/Classes/BaseCommand");
const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

class Ping extends Command {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("To check bot ping!")
        .setDMPermission(false),
      options: {
        //  premium: true,
        //  devOnly: false,
      },
    });
  }
  async execute(interactionN, client) {
    await interaction.reply(`> Pong! Please wait...`);
    const msg = await interaction.fetchReply();
    const ping = Math.floor(
      msg.createdTimestamp - interaction.createdTimestamp
    );
    const embed = new EmbedBuilder()
      .setColor(
        ping < 20 ? Colors.Green : ping < 40 ? Colors.Yellow : Colors.Red
      )
      .setDescription(
        `**${
          client.user.username
        }'s current ping:** \`${ping}ms\`\n\n> Discord's Gateway API ping: \`${
          client.ws.ping
        }ms\`\n> Bot uptime: <t:${parseInt(
          `${client.readyTimestamp / 1000}`
        )}:R>`
      );
    interaction.editReply({ embeds: [embed], content: "" });
  }
}

module.exports = Ping;
