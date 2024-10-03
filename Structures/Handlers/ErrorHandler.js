const { EmbedBuilder, WebhookClient, Colors } = require("discord.js");
const { inspect } = require("util");

async function ErrorHandler(client) {
  const webhook = new WebhookClient({
    url: client.config.logWebhook,
  });
  console.log("Error Handler has been loaded");

  const embed = new EmbedBuilder();
  client.on("error", (err) => {
    console.log(`${err}`);

    embed
      .setTitle("Discord API Error")
      .setURL("https://discordjs.guide/popular-topics/errors.html#api-errors")
      .setColor(Colors.Red)
      .setDescription(
        `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``
      )
      .setTimestamp();

    return webhook.send({ embeds: [embed] });
  });
  process.on("unhandledRejection", (reason, promise) => {
    console.log(`${reason}`);

    embed
      .setTitle("Unhandled Rejection/Catch")
      .setURL("https://nodejs.org/api/process.html#event-unhandledrejection")
      .setColor(Colors.Red)
      .addFields(
        {
          name: `Reason`,
          value: `\`\`\`${inspect(reason, { depth: 0 }).slice(0, 1000)}\`\`\``,
        },
        {
          name: "Promise",
          value: `\`\`\`${inspect(promise, { depth: 0 }).slice(0, 1000)}\`\`\``,
        }
      )
      .setTimestamp();

    return webhook.send({ embeds: [embed] });
  });

  process.on("uncaughtException", (err, origin) => {
    console.log(`${err} \n ${origin}`);

    embed
      .setTitle("Uncaught Exception/Catch")
      .setColor(Colors.Red)
      .setURL("https://nodejs.org/api/process.html#event-uncaughtexception")
      .addFields(
        {
          name: `Error`,
          value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``,
        },
        {
          name: "Origin",
          value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\``,
        }
      )
      .setTimestamp();

    return webhook.send({ embeds: [embed] });
  });

  process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log(`${err} \n ${origin}`);

    embed
      .setTitle("Uncaught Exception Monitor")
      .setColor(Colors.Red)
      .setURL(
        "https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor"
      )
      .addFields(
        {
          name: `Error`,
          value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``,
        },
        {
          name: "Origin",
          value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\``,
        }
      )
      .setTimestamp();

    return webhook.send({ embeds: [embed] });
  });

  process.on("warning", (warn) => {
    console.log(`Warn : ${warn}`);

    embed
      .setTitle("Uncaught Exception Monitor Warning")
      .setColor(Colors.Red)
      .setURL("https://nodejs.org/api/process.html#event-warning")
      .addFields({
        name: `Warn`,
        value: `\`\`\`${inspect(warn, { depth: 0 }).slice(0, 1000)}\`\`\``,
      })
      .setTimestamp();

    return webhook.send({ embeds: [embed] });
  });
}

module.exports = { ErrorHandler };
