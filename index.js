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
  app.get("/oauth", async (req, res) => oauth.oauth(req, res, appBot));

  // Slash command endpoint
  app.post("/command", textParser, async (req, res) =>
    command.command(req, res, appBot)
  );
})();

module.exports = {
  appBot
};

// module.exports = {
//   app,
//   initializeApp
// };
