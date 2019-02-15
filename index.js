const app = require("./slack/app");
const bot = require("./models/bot");

const appBot = new bot.Bot(
  process.env.SLACK_CLIENT_ID,
  process.env.SLACK_CLIENT_SECRET,
  process.env.SLACK_BOT_TOKEN
);

async function main() {
  // initialize uris
  app.initializeApp();
  // retrieve a list of users
  const users = await appBot.getUsers();
  // open DMs with each user
  const chats = await appBot.openDMs(users);
  // TODO: message each user to explain the tool
}

main();

module.exports = {
  appBot
};
