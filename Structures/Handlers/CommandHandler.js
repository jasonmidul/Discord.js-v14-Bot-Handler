const fs = require("fs");
const path = require("path");
const AsciiTable = require("ascii-table");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");

class CommandHandler {
  constructor() {}

  async loadCommands(client, isCmdDeploy) {
    const commandPath = fs.readdirSync(path.join(__dirname, "../../Commands"));
    const CommandsTable = new AsciiTable()
      .setHeading(
        "⠀⠀⠀⠀",
        "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Slash Command⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
        "⠀⠀Status⠀⠀"
      )
      .setBorder("┋", "═", "●", "●")
      .setAlign(2, AsciiTable.CENTER);

    let commandArray = [];
    let devCommandArray = [];
    let devCmdCount = 0;
    let cmdCount = 0;
    let i = 1;

    commandPath.forEach((dir) => {
      const commandFolder = fs.readdirSync(
        path.join(__dirname, `../../Commands/${dir}`)
      );

      commandFolder.forEach(async (file) => {
        const commandFile = require(`../../Commands/${dir}/${file}`);
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
    console.log(`</> • ${cmdCount} Slash commands has been loaded.`);
    console.log(`</> • ${devCmdCount} Developer commands has been loaded.`);

    if (isCmdDeploy) {
      const rest = new REST({ version: "10" }).setToken(client.config.botToken);
      await (async () => {
        try {
          await rest.put(Routes.applicationCommands(client.config.clientId), {
            body: commandArray,
          });
          console.log(
            `</> • ${cmdCount} Slash commands has been registered globally.`
          );
          client.config.devGuilds.forEach(async (guild) => {
            await rest.put(
              Routes.applicationGuildCommands(client.config.clientId, guild.id),
              {
                body: devCommandArray,
              }
            );
            console.log(
              `</> • Dev Commands registered for guild "${guild.name}"`
            );
          });
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }
}

module.exports = { CommandHandler };
