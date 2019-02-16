const bodyParser = require("body-parser");
const express = require("express");
const bot = require("./models/bot");
const command = require("./slack/command");
const events = require("./slack/events").events;
const oauth = require("./slack/oauth");

const appBot = new bot.Bot(
  process.env.SLACK_CLIENT_ID,
  process.env.SLACK_CLIENT_SECRET,
  process.env.SLACK_BOT_TOKEN,
  process.env.SLACK_SIGNING_SECRET,
  process.env.SLACK_VERIFICATION_TOKEN
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

  // handle events
  app.post("/events", jsonParser, async (req, res) => events(req, res, appBot));

  // app installation authentication
  app.get("/oauth", async (req, res) => oauth.oauth(req, res, appBot));

  // slash command
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
