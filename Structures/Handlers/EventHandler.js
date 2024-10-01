const fs = require("fs");
const path = require("path");
const AsciiTable = require("ascii-table");

class EventHandler {
  constructor() {}

  async loadEvents(client, gg) {
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
      const eventFolder = fs.readdirSync(
        path.join(__dirname, `../../Events/${dir}`)
      );

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
        client.events.set(event.name, execute);

        if (event.ONCE) {
          client.once(event.name, execute);
        } else {
          client.on(event.name, execute);
        }
      });
    });
    console.log(EventsTable.toString());
    console.log(`</> • ${eventCount} Events has been loaded.`);
  }
}

module.exports = { EventHandler };