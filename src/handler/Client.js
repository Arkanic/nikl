const { Client, Collection } = require("discord.js");
module.exports = class extends Client {
  constructor(config) {
    super({
      disableEveryone: true,
      disabledEvents: ["TYPING_START"] // typing is a no no
    });
    this.commands = new Collection(); // command collection
    this.config = config;
  }
}