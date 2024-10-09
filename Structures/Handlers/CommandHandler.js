const fs = require("fs");
const path = require("path");
const AsciiTable = require("ascii-table");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");
const { Logger } = require("../Functions/index");
const logger = new Logger();

class CommandHandler {
  constructor() {}

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
        const command = new commandFile(client);

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
    logger.info(`</> • ${cmdCount} Slash commands has been loaded.`);
    logger.info(`</> • ${devCmdCount} Developer commands has been loaded.`);

    if (update) {
      const rest = new REST({ version: "10" }).setToken(client.config.botToken);
      await (async () => {
        try {
          await rest.put(Routes.applicationCommands(client.config.clientId), {
            body: commandArray,
          });
          logger.success(
            `</> • ${cmdCount} Slash commands has been registered globally.`
          );
          client.config.devGuilds.forEach(async (guild) => {
            await rest.put(
              Routes.applicationGuildCommands(client.config.clientId, guild.id),
              {
                body: devCommandArray,
              }
            );
            logger.warn(
              `</> • Dev Commands registered for guild "${guild.name}"`
            );
          });
        } catch (error) {
          logger.error(error);
        }
      })();
    }
  }
}

module.exports = { CommandHandler };
