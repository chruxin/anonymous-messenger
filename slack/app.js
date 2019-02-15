const request = require("request");
const express = require("express");
const command = require("./command");
const oauth = require("./oauth");

const PORT = 4390 || process.env.PORT;

const app = express();

function initializeApp() {
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
  app.post("/command", command.command);
}

module.exports = {
  app,
  initializeApp
};
