const fs = require("fs");
const path = require("path");
const { Logger } = require("../Functions/index");
const logger = new Logger();

class ComponentHandler {
  constructor() {}
  /**
   *  A function to load components
   * @param {import("../Classes/BotClient").BotClient} client
   */
  async loadComponents(client) {
    const componentPath = fs.readdirSync(
      path.join(__dirname, "../../Interactions/Components")
    );
    await client.buttons.clear();
    await client.modals.clear();
    await client.autoComplete.clear();
    let buttonCount = 0;
    let modalCount = 0;
    let autoCompleteCount = 0;

    componentPath.forEach((dir) => {
      const componentFolder = fs
        .readdirSync(
          path.join(__dirname, `../../Interactions/Components/${dir}`)
        )
        .filter((file) => file.endsWith(".js"));

      componentFolder.forEach(async (file) => {
        const componentFile = require(`../../Interactions/Components/${dir}/${file}`);
        const component = new componentFile(client);
        switch (dir) {
          case "Buttons":
            client.buttons.set(component.id, component);
            buttonCount++;
            break;
          case "Modals":
            client.modals.set(component.id, component);
            modalCount++;
            break;
          case "AutoComplete":
            client.autoComplete.set(component.id, component);
            autoCompleteCount++;
            break;
        }
      });
    });

    logger.info(`${buttonCount} Buttons has been loaded.`);
    logger.info(`${modalCount} Modals has been loaded.`);
    logger.info(`${autoCompleteCount} AutoComplete has been loaded.`);
  }
}

module.exports = { ComponentHandler };
