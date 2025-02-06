const { WebhookClient } = require("discord.js");
const path = require("path");
const config = require("../../config");
const webhook =
  config.logWebhook.length > 0
    ? new WebhookClient({
        url: config.logWebhook,
      })
    : undefined;

class Logger {
  constructor() {}

  /**
   * A function to retrieve the filename
   * @returns {string}
   */
  get origin() {
    const _ = Error.prepareStackTrace;
    Error.prepareStackTrace = (error, stack) => stack;
    const { stack } = new Error();
    Error.prepareStackTrace = _;
    const callers = stack.map((x) => x.getFileName());
    const firstExternalFilePath = callers.find((x) => {
      return x !== callers[0];
    });
    return firstExternalFilePath
      ? path.basename(firstExternalFilePath)
      : "anonymous";
  }

  error(content) {
    const output =
      new Date().toLocaleTimeString() +
      `  🛑  [` +
      `${
        this.origin.length > 25
          ? this.origin.substring(0, 17) + "..."
          : this.origin
      }` +
      `] ` +
      " ".repeat(20 - (this.origin.length > 20 ? 20 : this.origin.length)) +
      "| " +
      content;
    if (webhook) {
      webhook.send({
        content: `> \`\`\`${output}\`\`\``,
      });
    }
    console.log(output);
  }

  info(content) {
    const output =
      new Date().toLocaleTimeString() +
      `  ✉️   [` +
      `${
        this.origin.length > 25
          ? this.origin.substring(0, 17) + "..."
          : this.origin
      }` +
      `] ` +
      " ".repeat(20 - (this.origin.length > 20 ? 20 : this.origin.length)) +
      "| " +
      content;
    if (webhook) {
      webhook.send({
        content: `> \`\`\`${output}\`\`\``,
      });
    }
    console.log(output);
  }
  warn(content) {
    const output =
      new Date().toLocaleTimeString() +
      `  ⚠️   [` +
      `${
        this.origin.length > 25
          ? this.origin.substring(0, 17) + "..."
          : this.origin
      }` +
      `] ` +
      " ".repeat(20 - (this.origin.length > 20 ? 20 : this.origin.length)) +
      "| " +
      content;
    if (webhook) {
      webhook.send({
        content: `> \`\`\`${output}\`\`\``,
      });
    }
    console.log(output);
  }

  success(content) {
    const output =
      new Date().toLocaleTimeString() +
      `  ✅  [` +
      `${
        this.origin.length > 25
          ? this.origin.substring(0, 17) + "..."
          : this.origin
      }` +
      `] ` +
      " ".repeat(20 - (this.origin.length > 20 ? 20 : this.origin.length)) +
      "| " +
      content;
    if (webhook) {
      webhook.send({
        content: `> \`\`\`${output}\`\`\``,
      });
    }
    console.log(output);
  }
  custom(content) {
    console.log(
      new Date().toLocaleTimeString() +
        `  🛑  [` +
        `${
          this.origin.length > 20
            ? this.origin.substring(0, 17) + "..."
            : this.origin
        }` +
        `] ` +
        " ".repeat(20 - (this.origin.length > 20 ? 20 : this.origin.length)) +
        "| " +
        content
    );
  }
}

module.exports = { Logger };
