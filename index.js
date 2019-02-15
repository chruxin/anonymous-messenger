const app = require('./slack/app')
const bot = require("./bot");

const PORT = 4390;

const appBot = new bot.Bot(
  process.env.SLACK_CLIENT_ID,
  process.env.SLACK_CLIENT_SECRET,
  process.env.SLACK_BOT_TOKEN
);

async function main() {
  app.initializeApp()
  const users = await appBot.getUsers()
  // TODO: message everyone
}

main()

module.exports = {
  appBot
};
