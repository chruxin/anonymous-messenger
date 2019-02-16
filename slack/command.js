const verify = require("../handlers/verify");
const parser = require("../handlers/parser");
const requests = require("./requests");

// Slash command.

async function command(req, res, bot) {
  const fromSlack = verify.verifySlack(req, bot);
  if (!fromSlack) {
    console.error(`Receive request not from Slack: ${req.body}`);
    return;
  }

  res.send("Message received and will be posted anonymously soon.");
  const body = parser.parseRequestBody(req.body);
  const general = "CG618UUBT";
  await requests.postMessage(body.user_id, body.text, general, bot);
}

module.exports = {
  command
};
