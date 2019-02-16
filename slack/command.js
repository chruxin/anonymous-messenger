const verify = require("../handlers/verify");
const strings = require("../strings/strings").strings;
const qs = require("query-string");
// Slash command.

async function command(req, res, bot) {
  const fromSlack = verify.verifySlack(req, bot);
  if (!fromSlack) {
    console.error(`Receive request not from Slack: ${req.body}`);
    return;
  }

  res.send(strings.MESSAGE_RECEIVED);
  const body = qs.parse(req.body);
  await bot.postToAnonymousChannel(body.user_id, body.text);
}

module.exports = {
  command
};
