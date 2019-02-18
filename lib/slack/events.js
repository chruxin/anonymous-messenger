const strings = require("../strings/strings");
const requests = require("./requests");
const printf = require("printf");

function isIM(event) {
  return (
    event !== undefined &&
    event.type === "message" &&
    event.subtype === undefined &&
    event.channel_type === "im"
  );
}

async function events(req, res, bot) {
  if (req.body.token !== bot.veriToken) {
    return;
  }
  switch (req.body.type) {
    case "url_verification":
      res.json({ challenge: req.body.challenge });
    case "event_callback":
      const event = req.body.event;
      if (isIM(event)) {
        res.sendStatus(200);
        await requests.postMessage(
          null,
          strings.MESSAGE_RECEIVED,
          event.channel,
          bot
        );
        const error = await bot.postToAnonymousChannel(event.user, event.text);
        if (error !== undefined) {
          await requests.postMessage(
            null,
            printf(strings.POST_MESSAGE_ERROR, error),
            event.channel,
            bot
          );
        }
      }
    default:
      return;
  }
}

module.exports = events;
