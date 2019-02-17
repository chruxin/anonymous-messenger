const printf = require("printf");
const request = require("request-promise");
const requests = require("./requests");
const strings = require("../strings/strings");
const User = require("../models/user");

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

function pickChannel(channels) {
  if (channels.length === 0) {
    throw new Error("No public channel.");
  }
  // pick anonymous if it exists
  let loc = channels.filter(channel => channel.name === "anonymous");
  if (loc.length > 0) {
    return loc[0];
  }
  // otherwise, pick random
  loc = channels.filter(channel => channel.name === "random");
  if (loc.length > 0) {
    return loc[0];
  }
  // just pick the first one if none of the above is available
  return channels[0];
}

async function notifyAll(bot) {
  // retrieve a list of users
  const users = await bot.getUsers();
  // save them to db
  await User.insertMany(users);
  // retrieve a list of channels
  const channels = await bot.getPublicChannels();
  const channel = pickChannel(channels);
  bot.setChannel(channel);
  // open DMs with each user
  const dms = await bot.openDMs(users);
  // message each user to explain the tool and
  // include the channel that will be used to post messages
  const promises = [];
  const message = printf(strings.TOOL_EXPLANATION, channel.name);
  for (const dm of dms) {
    promises.push(requests.postMessage(null, message, dm.id, bot));
  }
  await Promise.all(promises);
}

module.exports = oauth;
