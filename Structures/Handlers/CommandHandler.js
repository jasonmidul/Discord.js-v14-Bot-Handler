const fs = require("fs");
const path = require("path");
const AsciiTable = require("ascii-table");

class CommandHandler {
  constructor() {}

  /** A function to load commands
   * @param {import("../Classes/BotClient").BotClient} client
   * @param {boolean} update
   */
  async loadCommands(client, update) {
    const commandPath = fs.readdirSync(
      path.join(__dirname, "../../Interactions/SlashCommands")
    );
    const CommandsTable = new AsciiTable()
      .setHeading(
        "⠀⠀⠀⠀",
        "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Slash Command⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
        "⠀⠀Status⠀⠀"
      )
      .setBorder("┋", "═", "●", "●")
      .setAlign(2, AsciiTable.CENTER);

    await client.slashCommands.clear();
    let commandArray = [];
    let devCommandArray = [];
    let devCmdCount = 0;
    let cmdCount = 0;
    let i = 1;

    commandPath.forEach((dir) => {
      const commandFolder = fs
        .readdirSync(
          path.join(__dirname, `../../Interactions/SlashCommands/${dir}`)
        )
        .filter((file) => file.endsWith(".js"));

      commandFolder.forEach(async (file) => {
        const commandFile = require(`../../Interactions/SlashCommands/${dir}/${file}`);
        const command = new commandFile(client, dir);

        if (dir == "Dev") {
          client.slashCommands.set(command.data.name, command);
          devCommandArray.push(command.data.toJSON());
          devCmdCount++;
          CommandsTable.addRow(
            (i++).toString() + ".",
            command.name + "(dev)",
            "» 🌱 «"
          );
        } else {
          client.slashCommands.set(command.data.name, command);
          commandArray.push(command.data.toJSON());
          cmdCount++;
          CommandsTable.addRow((i++).toString() + ".", command.name, "» 🌱 «");
        }
      });
    });
    console.log(CommandsTable.toString());
    client.logger.info(`</> • ${cmdCount} Slash commands has been loaded.`);
    client.logger.info(
      `</> • ${devCmdCount} Developer commands has been loaded.`
    );

    if (update) {
      await (async () => {
        try {
          await client.application.commands.set(commandArray);
          client.logger.success(
            `</> • ${cmdCount} Slash commands has been registered globally.`
          );
          client.config.devGuilds.forEach(async (devGuild) => {
            const guild = client.guilds.cache.get(devGuild.id);

            if (guild) {
              guild.commands.set(devCommandArray);
              client.logger.warn(
                `</> • Dev Commands registered for guild "${devGuild.name}"`
              );
            }
          });
        } catch (error) {
          client.logger.error(error);
        }
      })();
    }
  }
}

module.exports = { CommandHandler };
