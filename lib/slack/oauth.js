const printf = require("printf");
const request = require("request-promise");
const requests = require("./requests");
const strings = require("../strings/strings");
const User = require("../models/user");
const common = require("./common");

async function oauth(req, res, bot) {
  // When a user authorizes an app, a code query parameter is passed on the
  // oAuth endpoint. If that code is not there, we respond with an error message
  if (!req.query.code) {
    res.status(500);
    res.send({ Error: "Authentication code not present." });
    throw new Error("Authentication code not present.");
  }
  let response;
  try {
    response = await request({
      url: "https://slack.com/api/oauth.access",
      qs: {
        code: req.query.code,
        client_id: bot.clientId,
        client_secret: bot.clientSecret
      },
      method: "GET"
    });
    res.json(response);
    await notifyAll(bot);
  } catch (error) {
    console.error(`Error authenticating app: ${error}`);
  }
}

async function notifyAll(bot) {
  try {
    const users = await common.updateUsers(bot);
    await common.updatePublicChannels(bot);
    const channel = await common.updateChannelToPost();

    // open IMs with each user
    const ims = await bot.openIMs(users);
    // message each user to explain the tool and
    // include the channel that will be used to post messages
    const promises = [];
    const message = printf(strings.TOOL_EXPLANATION, channel.name);
    const attachment = [
      {
        text: "Would you like to post a message now?",
        fallback: "Message me now :blush:",
        callback_id: "post_message",
        actions: [
          {
            name: "option",
            text: "Yes :100:",
            type: "button",
            value: "yes",
            style: "primary"
          }
        ]
      }
    ];
    for (const im of ims) {
      promises.push(
        requests.postMessage(null, message, attachment, im.id, bot)
      );
    }
    await Promise.all(promises);
  } catch (error) {
    console.error(`Error messaging every user: ${error}`);
  }
}

module.exports = oauth;
