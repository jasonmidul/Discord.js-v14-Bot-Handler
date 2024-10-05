const { WebhookClient } = require("discord.js");
const { inspect } = require("util");
const { Logger } = require("../Functions/index");
const logger = new Logger();
const config = require("../../config");

async function ClientErrorHandler(client) {
  const webhook = new WebhookClient({
    url: config.logWebhook,
  });
  client.on("error", (err) => {
    logger.custom(`${err}`);
    return webhook.send({
      content: `⛔ **Discord API Error** \`\`\`${inspect(err, {
        depth: 0,
      }).slice(0, 1990)}\`\`\``,
    });
  });
}
async function ErrorHandler() {
  const webhook = new WebhookClient({
    url: config.logWebhook,
  });
  logger.success("Error Handler has been loaded");

  process.on("unhandledRejection", (reason, promise) => {
    logger.custom(`${reason}`);

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
  });

  process.on("uncaughtException", (err, origin) => {
    logger.custom(`${err}`);

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
  });

  process.on("uncaughtExceptionMonitor", (err, origin) => {
    logger.custom(`${err}`);

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
  });

  process.on("warning", (warn) => {
    logger.custom(`${warn}`);

    webhook.send({
      content: `## ⚠️ Uncaught Exception Monitor Warning`,
    });
    return webhook.send({
      content: `**Warn** \`\`\`${inspect(warn, { depth: 0 }).slice(
        0,
        1990
      )}\`\`\``,
    });
  });
}

module.exports = { ErrorHandler, ClientErrorHandler };
