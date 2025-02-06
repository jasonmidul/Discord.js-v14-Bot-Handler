const { WebhookClient } = require("discord.js");
const { inspect } = require("util");
const config = require("../../config");
const webhook =
  config.logWebhook.length > 0
    ? new WebhookClient({
        url: config.logWebhook,
      })
    : undefined;
/**
 * Error handler function
 * @param {import("../Classes/BotClient").BotClient} client
 */
async function ClientErrorHandler(client) {
  client.on("error", (err) => {
    client.logger.custom(`${err}`);

    if (webhook) {
      return webhook.send({
        content: `⛔ **Discord API Error** \`\`\`${inspect(err, {
          depth: 0,
        }).slice(0, 1990)}\`\`\``,
      });
    }
  });
}

/**
 * Error handler function
 * @param {import("../Classes/BotClient").BotClient} client
 */
async function ErrorHandler(client) {
  const webhook =
    config.logWebhook.length > 0
      ? new WebhookClient({ url: config.logWebhook })
      : undefined;
  client.logger.success("Error Handler has been loaded");

  process.on("unhandledRejection", (reason, promise) => {
    client.logger.custom(`${reason}`);

    if (webhook) {
      webhook.send({
        content: `## ‼️ Unhandled Rejection/Catch`,
      });
      webhook.send({
        content: `**Reason** \`\`\`${inspect(reason, { depth: 0 }).slice(
          0,
          1990
        )}\`\`\``,
      });
      return webhook.send({
        content: `**Promise** \`\`\`${inspect(promise, { depth: 0 }).slice(
          0,
          1990
        )}\`\`\``,
      });
    }
  });

  process.on("uncaughtException", (err, origin) => {
    client.logger.custom(`${err}`);

    if (webhook) {
      webhook.send({
        content: `## ‼️ Uncaught Exception/Catch`,
      });
      webhook.send({
        content: `**Error** \`\`\`${inspect(err, { depth: 0 }).slice(
          0,
          1990
        )}\`\`\``,
      });
      return webhook.send({
        content: `**Origin** \`\`\`${inspect(origin, { depth: 0 }).slice(
          0,
          1990
        )}\`\`\``,
      });
    }
  });

  process.on("uncaughtExceptionMonitor", (err, origin) => {
    client.logger.custom(`${err}`);

    if (webhook) {
      webhook.send({
        content: `## ‼️ Uncaught Exception Monitor`,
      });
      webhook.send({
        content: `**Error** \`\`\`${inspect(err, { depth: 0 }).slice(
          0,
          1990
        )}\`\`\``,
      });
      return webhook.send({
        content: `**Origin** \`\`\`${inspect(origin, { depth: 0 }).slice(
          0,
          1990
        )}\`\`\``,
      });
    }
  });

  process.on("warning", (warn) => {
    client.logger.custom(`${warn}`);

    if (webhook) {
      webhook.send({
        content: `## ⚠️ Uncaught Exception Monitor Warning`,
      });
      return webhook.send({
        content: `**Warn** \`\`\`${inspect(warn, { depth: 0 }).slice(
          0,
          1990
        )}\`\`\``,
      });
    }
  });
}

module.exports = { ErrorHandler, ClientErrorHandler };
