const strings = require("../strings/strings").strings;
const requests = require("./requests");

function isDM(event) {
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
      if (isDM(event)) {
        res.sendStatus(200);
        await requests.postMessage(
          null,
          strings.MESSAGE_RECEIVED,
          event.channel,
          bot
        );
        await bot.postToAnonymousChannel(event.user, event.text);
      }
    default:
      return;
  }
}

module.exports = {
  events
};
