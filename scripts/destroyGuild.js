require("dotenv").config();
const { REST, Routes } = require("discord.js");
const colors = require("colors");
const config = require("../config.js");
const token = config.botToken;
const clientId = config.clientId;
const devGuilds = config.devGuilds;
const readline = require("readline");
const rest = new REST({ version: 10 }).setToken(token);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const warningMsg =
  colors.yellow(`----------------------------------- !!! WARNING !!! -----------------------------------
This script will delete every guild slash & context menu command of your discord bot.
Do you want to continue? (y/n): `);

console.clear();
rl.question(warningMsg, async function (name) {
  try {
    if (name.toLowerCase() === "y") {
      if (Array.isArray(devGuilds)) {
        for (const devGuild of devGuilds) {
          await deleteCommands(devGuild.id);
        }
      } else {
        console.log(colors.red("devGuilds must be and array."));
      }
      process.exit(0);
    } else {
      console.log(colors.red("Canceled the deletion."));
      process.exit(0);
    }
  } catch (error) {
    console.log(colors.red(error?.stack ? error?.stack : error));
    process.exit(1);
  }
});

/** Function to delete all commands in a guild
 * @param {string} guildId
 * @returns {Promise<void>}
 */
async function deleteCommands(guildId) {
  const guild = await rest.get(Routes.guild(guildId)).catch((e) => {});

  if (!guild) {
    return console.log(
      colors.red(
        `❗ Couldn't fing any guild with id ${colors.underline(guildId)}.`,
        "\n"
      )
    );
  }

  const commands = await rest.get(
    Routes.applicationGuildCommands(clientId, guildId)
  );

  if (commands?.length === 0) {
    return console.log(
      colors.red(
        `❗ Couldn't fing any guild command in ${colors.underline(guild.name)}.`
      )
    );
  }

  console.log(
    colors.cyan(
      `✅ Found ${commands.length} guild commands in ${colors.underline(
        guild.name
      )}.\n`
    )
  );

  let i = 0;
  commands.forEach((command) => {
    i++;
    console.log(
      colors.yellow(
        `${i >= 100 ? "" : i >= 10 ? " " : "  "}${i} | 🔥 Deleted command - ${
          command.id
        } - ${command.name} `
      )
    );
  });

  await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: [],
  });

  return console.log(
    colors.green(
      `\n✅ Deleted ${i} commands in ${colors.underline(guild.name)}.`
    )
  );
}
