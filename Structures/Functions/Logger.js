const { WebhookClient } = require("discord.js");
const { inspect } = require("util");
const config = require("../../config");
const webhook =
  config.logWebhook.length > 0
    ? new WebhookClient({
        url: config.logWebhook,
      })
    : undefined;

class Logger {
  constructor() {
    this.origin = this._getLogOrigin().split(/[\\/]/).pop();
  }
  _getLogOrigin() {
    let filename;

    let _pst = Error.prepareStackTrace;
    Error.prepareStackTrace = function (err, stack) {
      return stack;
    };
    try {
      let err = new Error();
      let callerfile;
      let currentfile;

      currentfile = err.stack.shift().getFileName();

      while (err.stack.length) {
        callerfile = err.stack.shift().getFileName();

        if (currentfile !== callerfile) {
          filename = callerfile;
          break;
        }
      }
    } catch (err) {}
    Error.prepareStackTrace = _pst;

    return filename;
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
