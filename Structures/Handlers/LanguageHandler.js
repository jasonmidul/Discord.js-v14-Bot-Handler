const i18next = require("i18next");
const resources = require("../../locales/resources");

function loadLanguages() {
  i18next.init({
    fallbackLng: "en",
    defaultNS: "system",
    interpolation: {
      escapeValue: false,
    },
    resources,
  });
}
module.exports = { loadLanguages };
