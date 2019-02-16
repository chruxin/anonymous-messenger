const bodyParser = require("body-parser");
const express = require("express");
const bot = require("./models/bot");
const command = require("./slack/command");
const oauth = require("./slack/oauth");

const appBot = new bot.Bot(
  process.env.SLACK_CLIENT_ID,
  process.env.SLACK_CLIENT_SECRET,
  process.env.SLACK_BOT_TOKEN,
  process.env.SLACK_SIGNING_SECRET
);

const PORT = 4390 || process.env.PORT;

const app = express();
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const textParser = bodyParser.text({
  type: "application/x-www-form-urlencoded"
});

(function initializeApp() {
  app.listen(PORT, () => {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Example app listening on port " + PORT);
  });

  app.get("/", (req, res) => {
    res.send("Ngrok is working! Path Hit: " + req.url);
  });

  // This route handles get request to a /oauth endpoint. We'll use this
  // endpoint for handling the logic of the Slack oAuth process behind our app.
  app.get("/oauth", oauth.oauth);

  // Slash command endpoint
  app.post("/command", textParser, async (req, res) =>
    command.command(req, res, appBot)
  );
})();

async function main() {
  // initialize uris
  // retrieve a list of users
  // const users = await appBot.getUsers();
  // open DMs with each user
  // const chats = await appBot.openDMs(users);
  // TODO: message each user to explain the tool
}

module.exports = {
  appBot
};

// module.exports = {
//   app,
//   initializeApp
// };
