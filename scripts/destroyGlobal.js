require("dotenv").config();
const { REST, Routes } = require("discord.js");
const colors = require("colors");
const config = require("../config.js");
const token = config.botToken;
const clientId = config.clientId;
const readline = require("readline");
const rest = new REST({ version: 10 }).setToken(token);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const warningMsg =
  colors.yellow(`----------------------------------- !!! WARNING !!! -----------------------------------
This script will delete every global slash & context menu command of your discord bot.
Do you want to continue? (y/n): `);

console.clear();
rl.question(warningMsg, async function (name) {
  try {
    if (name.toLowerCase() === "y") {
      await deleteCommands();
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

async function deleteCommands() {
  const commands = await rest.get(Routes.applicationCommands(clientId));

  if (commands?.length === 0) {
    return console.log(colors.red("❗ Couldn't fing any global command."));
  }

  console.log(colors.cyan(`✅ Found ${commands.length} global commands.\n`));

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

  await rest.put(Routes.applicationCommands(clientId), {
    body: [],
  });

  return console.log(colors.green(`\n✅ Deleted ${i} global commands.`));
}
