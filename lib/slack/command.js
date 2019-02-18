const verify = require("../handlers/verify").verifySlack;
const strings = require("../strings/strings");
const printf = require("printf");
const qs = require("query-string");

async function command(req, res, bot) {
  const fromSlack = verify(req, bot);
  if (!fromSlack) {
    console.error(`Received request not from Slack: ${req.body}`);
    return;
  }

  res.send(strings.MESSAGE_RECEIVED);
  const body = qs.parse(req.body);
  try {
    const error = await bot.postToAnonymousChannel(body.user_id, body.text);
    if (error !== undefined) {
      await requests.postMessage(
        null,
        printf(strings.POST_MESSAGE_ERROR, error),
        event.channel,
        bot
      );
    }
  } catch (error) {
    console.error(`Error posting message with slash command: ${error}`);
  }
}

module.exports = command;
