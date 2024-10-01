module.exports = class Command {
  constructor(client, option) {
    this.client = client;
    this.data = option.data;
    this.name = option.data.name;
    this.options = option.options;
  }
  async execute(...args) {
    return await Promise.resolve();
  }
};
