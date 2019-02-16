const request = require("request-promise");
const requests = require("./requests");

async function oauth(req, res, bot) {
  // When a user authorizes an app, a code query parameter is passed on the
  // oAuth endpoint. If that code is not there, we respond with an error message
  if (!req.query.code) {
    res.status(500);
    res.send({ Error: "Looks like we're not getting code." });
    // TODO: error handling middleware?
    console.log("Looks like we're not getting code.");
    return;
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
  // retrieve a list of channels
  const channels = await bot.getPublicChannels();
  const channel = pickChannel(channels);
  // open DMs with each user
  const dms = await bot.openDMs(users);
  // message each user to explain the tool and
  // include the channel that will be used to post messages
  const promises = [];
  const message = `Hello I'm a bot that posts anonymous messages to the ${
    channel.name
  } channel. You can also invoke me with the /anon command.`;
  for (const dm of dms) {
    promises.push(requests.postMessage(null, message, dm.id, bot));
  }
  await Promise.all(promises);
}

module.exports = {
  oauth
};
