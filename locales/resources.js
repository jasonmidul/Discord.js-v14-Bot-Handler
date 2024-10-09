const command_en = require("./en/command.json");
const component_en = require("./en/component.json");
const system_en = require("./en/system.json");
const command_bn = require("./bn/command.json");
const component_bn = require("./bn/component.json");
const system_bn = require("./bn/system.json");

const resources = {
  en: {
    system: system_en,
    command: command_en,
    component: component_en,
  },
  bn: {
    system: system_bn,
    command: command_bn,
    component: component_bn,
  },
};

module.exports = resources;
