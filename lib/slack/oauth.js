const printf = require("printf");
const request = require("request-promise");
const requests = require("./requests");
const strings = require("../strings/strings");
const User = require("../models/user");
const conv = require("../models/conversation");
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
        client_id: bot.client_id,
        client_secret: bot.client_secret
      },
      method: "GET"
    });
  } catch (error) {
    throw error;
  }
  res.json(response);
  await notifyAll(bot);
}

async function notifyAll(bot) {
  const users = await bot.getUsers();
  await User.insertMany(users);

  const channels = await bot.getPublicChannels();
  await conv.Conversation.insertMany(channels);

  const channel = conv.pickChannel(channels);
  await conv.Conversation.findOneAndUpdate({ id: channel.id }, { post: true });

  // open IMs with each user
  const ims = await bot.openIMs(users);
  // message each user to explain the tool and
  // include the channel that will be used to post messages
  const promises = [];
  const message = printf(strings.TOOL_EXPLANATION, channel.name);
  for (const im of ims) {
    promises.push(requests.postMessage(null, message, im.id, bot));
  }
  await Promise.all(promises);
}

module.exports = oauth;
