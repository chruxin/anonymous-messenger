const verify = require("../handlers/verify");
const parser = require("../handlers/parser");
const strings = require("../strings/strings").strings;
// Slash command.

async function command(req, res, bot) {
  const fromSlack = verify.verifySlack(req, bot);
  if (!fromSlack) {
    console.error(`Receive request not from Slack: ${req.body}`);
    return;
  }

  res.send(strings.MESSAGE_RECEIVED);
  const body = parser.parseRequestBody(req.body);
  await bot.postToAnonymousChannel(body.user_id, body.text);
}

module.exports = {
  command
};
