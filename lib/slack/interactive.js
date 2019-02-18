const qs = require("query-string");
const requests = require("./requests");
const strings = require("../strings/strings");
const verify = require("../handlers/verify");

async function interactive(req, res, bot) {
  const fromSlack = verify(req, bot);
  if (!fromSlack) {
    console.error(`Received request not from Slack: ${req.body}`);
    res.sendStatus(404);
    return;
  }

  let body = qs.parse(req.body);
  body = JSON.parse(body.payload);

  // bottn clicked
  if (
    body.type === "interactive_message" &&
    body.callback_id === "post_message"
  ) {
    res.status(200).send(strings.MESSAGE_YES_BUTTON_CLICKED);
    const qs = {
      trigger_id: body.trigger_id,
      dialog: {
        callback_id: "dialog",
        title: "Post a message",
        submit_label: "Post",
        elements: [
          {
            type: "textarea",
            label: "Message",
            name: "message",
            placeholder: "Thoughts?"
          }
        ]
      }
    };
    await requests.openDialog(bot.token, qs);
    return;
  }

  // dialog submitted
  if (body.type === "dialog_submission" && body.callback_id === "dialog") {
    try {
      if (body.submission.message !== undefined) {
        // valid submission
        res.status(200).send({});
        await requests.postMessage(
          null,
          strings.MESSAGE_RECEIVED,
          null,
          body.channel.id,
          bot
        );
        await bot.postToAnonymousChannel(body.user.id, body.submission.message);
      }
    } catch (error) {
      console.log(`Error submitting dialog: ${error}`);
    }
    return;
  }
}

module.exports = interactive;
