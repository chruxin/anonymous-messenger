const strings = require("../strings/strings");
const requests = require("./requests");
const verify = require("../handlers/verify");
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
  const fromSlack = verify(req, bot);
  if (!fromSlack) {
    console.error(`Received request not from Slack: ${req.body}`);
    res.sendStatus(404);
    return;
  }

  const body = req.body;

  switch (body.type) {
    case "url_verification":
      res.json({ challenge: body.challenge });
      break;
    case "event_callback":
      try {
        const event = body.event;
        if (isIM(event)) {
          res.sendStatus(200);
          await requests.postMessage(
            null,
            strings.MESSAGE_RECEIVED,
            null,
            event.channel,
            bot
          );
          const error = await bot.postToAnonymousChannel(
            event.user,
            event.text
          );
          if (error !== undefined) {
            await requests.postMessage(
              null,
              printf(strings.POST_MESSAGE_ERROR, error),
              null,
              event.channel,
              bot
            );
          }
        }
      } catch (error) {
        console.error(`Error handling event: ${error}`);
      }
      break;
    default:
      break;
  }
}

module.exports = events;
