/* Entry point of the app */
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const Bot = require("./models/bot");
const command = require("./slack/command");
const events = require("./slack/events");
const interactive = require("./slack/interactive");
const oauth = require("./slack/oauth");

const appBot = new Bot(
  process.env.SLACK_CLIENT_ID,
  process.env.SLACK_CLIENT_SECRET,
  process.env.SLACK_BOT_TOKEN,
  process.env.SLACK_SIGNING_SECRET,
  process.env.SLACK_VERIFICATION_TOKEN
);

function initializeDB() {
  mongoose.connect("mongodb://localhost/anonymous-messenger", {
    useNewUrlParser: true
  });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
}

function initializeApp() {
  const PORT = 4390 || process.env.PORT;

  const app = express();

  const rawBodyBuffer = (req, res, buf, encoding) => {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || "utf8");
    }
  };

  app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
  app.use(bodyParser.json({ verify: rawBodyBuffer }));

  app.listen(PORT, () => {
    console.log("App listening on port " + PORT);
  });

  app.get("/", (req, res) => {
    res.send("Ngrok is working! Path Hit: " + req.url);
  });

  // handle events
  app.post("/events", async (req, res) => events(req, res, appBot));

  app.post("/interactive", async (req, res) => interactive(req, res, appBot));

  // app installation authentication
  app.get("/oauth", async (req, res) => oauth(req, res, appBot));

  // slash command
  app.post("/command", async (req, res) => command(req, res, appBot));
}

function main() {
  initializeDB();
  initializeApp();
}

main();
