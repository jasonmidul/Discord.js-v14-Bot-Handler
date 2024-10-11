const command_en = require("./en/command.json");
const component_en = require("./en/component.json");
const system_en = require("./en/system.json");
const command_bn = require("./bn/command.json");
const component_bn = require("./bn/component.json");
const system_bn = require("./bn/system.json");
const command_fr = require("./fr/command.json");
const component_fr = require("./fr/component.json");
const system_fr = require("./fr/system.json");
const command_pt_br = require("./pt-br/command.json");
const component_pt_br = require("./pt-br/component.json");
const system_pt_br = require("./pt-br/system.json");

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
  fr: {
    system: system_fr,
    command: command_fr,
    component: component_fr,
  },
  pt_br: {
    system: system_pt_br,
    command: command_pt_br,
    component: component_pt_br,
  },
};

module.exports = resources;
