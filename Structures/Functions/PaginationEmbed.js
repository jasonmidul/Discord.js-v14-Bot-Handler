const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = async (interaction, embeds) => {
  const pages = {};
  const getRow = (id) => {
    return new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("◀")
        .setCustomId("prev_embed")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(pages[id] === 0),
      new ButtonBuilder()
        .setLabel("🗑️")
        .setCustomId("delete")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setLabel("▶")
        .setCustomId("next_embed")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(pages[id] === embeds.length - 1)
    );
  };

  const id = interaction.user.id;
  pages[id] = pages[id] || 0;
  let Pagemax = embeds.length;

  const embed = embeds[pages[id]];

  await embeds[pages[id]].setFooter({
    text: `Page ${pages[id] + 1} from ${Pagemax}`,
  });

  await interaction.reply({
    embeds: [embed],
    components: [getRow(id)],
  });

  let replyEmbed = await interaction.fetchReply();

  const filter = (i) => i.user.id === interaction.user.id;
  const time = 1000 * 60 * 5;

  const collector = await replyEmbed.createMessageComponentCollector({
    filter,
    time,
  });

  collector.on("collect", async (b) => {
    if (!b) return;
    if (b.customId !== "prev_embed" && b.customId !== "next_embed") return;

    b.deferUpdate();

    if (b.customId === "prev_embed" && pages[id] > 0) {
      --pages[id];
    } else if (b.customId === "next_embed" && pages[id] < embeds.length - 1) {
      ++pages[id];
    }

    await embeds[pages[id]].setFooter({
      text: `Page ${pages[id] + 1} of ${Pagemax}`,
    });

    await interaction.editReply({
      embeds: [embeds[pages[id]]],
      components: [getRow(id)],
    });

    replyEmbed = await interaction.fetchReply();
  });
  collector.on("end", async () => {
    try {
      await interaction.editReply({
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel("◀")
              .setCustomId("prev_embed")
              .setStyle(ButtonStyle.Primary)
              .setDisabled(true),
            new ButtonBuilder()
              .setLabel("🗑️")
              .setCustomId("delete")
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setLabel("▶")
              .setCustomId("next_embed")
              .setStyle(ButtonStyle.Primary)
              .setDisabled(true)
          ),
        ],
      });
    } catch (error) {}
  });
};
