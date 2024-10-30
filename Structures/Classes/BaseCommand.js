module.exports = class Command {
  constructor(client, dir, option) {
    this.client = client;
    this.data = option.data;
    this.name = option.data.name;
    this.options = option.options;
    this.category = dir;
  }
  async execute(...args) {
    return await Promise.resolve();
  }
};
