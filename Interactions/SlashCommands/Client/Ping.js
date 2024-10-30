const Command = require("../../../Structures/Classes/BaseCommand");
const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const { t } = require("i18next");

class Ping extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("To check bot ping!")
        .setDMPermission(false),
      options: {
        //  premiumGuild: true,
        //  premiumUser: true,
        //  devOnly: false,
      },
    });
  }
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../../Structures/Classes/BotClient").BotClient} client
   * @param {string} lng
   */
  async execute(interaction, client, lng) {
    await interaction.reply(t("command:ping.reply", { lng }));
    const msg = await interaction.fetchReply();
    const ping = Math.floor(
      msg.createdTimestamp - interaction.createdTimestamp
    );
    const embed = new EmbedBuilder()
      .setColor(
        ping < 20 ? Colors.Green : ping < 40 ? Colors.Yellow : Colors.Red
      )
      .setDescription(
        t("command:ping.embed.description", {
          lng,
          client: client.user.username,
          ping,
          apiPing: client.ws.ping,
          uptime: parseInt(`${client.readyTimestamp / 1000}`),
        })
      );
    interaction.editReply({ embeds: [embed], content: "" });
  }
}

module.exports = Ping;
