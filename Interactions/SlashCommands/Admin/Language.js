const Command = require("../../../Structures/Classes/BaseCommand");
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  Colors,
} = require("discord.js");
const { languageDatas } = require("../../../Schemas/index");
const { t } = require("i18next");

class Language extends Command {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("language")
        .setDescription("Set a language for this server.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
          option
            .setName("language")
            .setDescription("Select a language.")
            .setRequired(true)
            .addChoices([
              { name: "English", value: "en" },
              { name: "বাংলা", value: "bn" },
              { name: "Brazilian Português", value: "pt-br" },
              { name: "français", value: "fr" },
            ])
        ),
    });
  }
  async execute(interaction) {
    const lng = interaction.options.getString("language");
    const languageData = await languageDatas.findOne({
      guildId: interaction.guildId,
    });

    languageData.lng = lng;
    languageData.save();
    interaction.reply({
      content: t("command:language.success", {
        lng: lng,
        data:
          lng == "en"
            ? "English"
            : lng == "bn"
            ? "বাংলা"
            : lng == "fr"
            ? "français"
            : "Brazilian Português",
        user: interaction.user.id,
      }),
    });
  }
}

module.exports = Language;
