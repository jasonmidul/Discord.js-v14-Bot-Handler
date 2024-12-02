module.exports = function guildFind(id, ids) {
  let match;
  try {
    ids.forEach(async (guild) => {
      if (id == guild.id) {
        match = true;
      }
    });
  } catch (error) {
    match = false;
  }

  return match;
};
