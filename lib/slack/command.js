const verify = require("../handlers/verify");
const strings = require("../strings/strings");
const printf = require("printf");

async function command(req, res, bot) {
  const fromSlack = verify(req, bot);
  if (!fromSlack) {
    console.error(`Received request not from Slack: ${req.body}`);
    res.sendStatus(404);
    return;
  }

  res.send(strings.MESSAGE_RECEIVED);
  const body = req.body;
  try {
    const error = await bot.postToAnonymousChannel(body.user_id, body.text);
    if (error !== undefined) {
      await requests.postMessage(
        null,
        printf(strings.POST_MESSAGE_ERROR, error),
        null,
        event.channel,
        bot
      );
    }
  } catch (error) {
    console.error(`Error posting message with slash command: ${error}`);
  }
}

module.exports = command;
