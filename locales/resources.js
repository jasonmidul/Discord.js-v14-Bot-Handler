const command_en = require("./en/command.json");
const component_en = require("./en/component.json");
const system_en = require("./en/system.json");
const command_bn = require("./bn/command.json");
const component_bn = require("./bn/component.json");
const system_bn = require("./bn/system.json");
const command_pt = require("./pt/command.json");
const component_pt = require("./pt/component.json");
const system_pt = require("./pt/system.json");

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
  pt: {
    system: system_pt,
    command: command_pt,
    component: component_pt,
  },
};

module.exports = resources;
