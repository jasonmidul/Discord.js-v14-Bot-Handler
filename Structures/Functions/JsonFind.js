module.exports = function guildFind(id, ids) {
  let match;
  ids.forEach(async (guild) => {
    if (id == guild.id) {
      match = true;
    }
  });
  return match;
};
