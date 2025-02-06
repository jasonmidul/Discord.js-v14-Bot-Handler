const fs = require("fs");
const path = require("path");
const AsciiTable = require("ascii-table");

class EventHandler {
  constructor() {}
  /**
   * Event handler function
   * @param {import("../Classes/BotClient").BotClient} client
   */
  async loadEvents(client) {
    const EventsTable = new AsciiTable()
      .setHeading(
        "⠀⠀⠀⠀",
        "⠀⠀⠀⠀⠀⠀⠀⠀Events⠀⠀⠀⠀⠀⠀⠀⠀",
        "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀File⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
        "⠀⠀Status⠀⠀"
      )
      .setBorder("┋", "═", "●", "●")
      .setAlign(3, AsciiTable.CENTER);
    const eventPath = fs.readdirSync(path.join(__dirname, "../../Events"));

    await client.events.clear();
    let eventCount = 0;

    eventPath.forEach((dir) => {
      const eventFolder = fs
        .readdirSync(path.join(__dirname, `../../Events/${dir}`))
        .filter((file) => file.endsWith(".js"));

      eventFolder.forEach(async (file) => {
        const eventFile = require(`../../Events/${dir}/${file}`);

        const event = new eventFile(client);
        eventCount++;
        EventsTable.addRow(
          eventCount.toString() + ".",
          event.name,
          file,
          "» 🌱 «"
        );
        const execute = (...args) => event.execute(...args, client);
        client.events.set(file, {
          execute: execute,
          name: event.name,
        });

        if (event.ONCE) {
          client.once(event.name, execute);
        } else {
          client.on(event.name, execute);
        }
      });
    });
    console.log(EventsTable.toString());
    client.logger.success(`</> • ${eventCount} Events has been loaded.`);
  }
}

module.exports = { EventHandler };
