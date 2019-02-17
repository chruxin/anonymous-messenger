const verify = require("../handlers/verify").verifySlack;
const strings = require("../strings/strings");
const printf = require("printf");
const qs = require("query-string");
// Slash command.

async function command(req, res, bot) {
  const fromSlack = verify(req, bot);
  if (!fromSlack) {
    console.error(printf(strings.NONSLACK_REQUEST, req.body));
    return;
  }

  res.send(strings.MESSAGE_RECEIVED);
  const body = qs.parse(req.body);
  await bot.postToAnonymousChannel(body.user_id, body.text);
}

module.exports = command;