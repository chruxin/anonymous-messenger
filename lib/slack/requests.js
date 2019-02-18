const printf = require("printf");
const request = require("request-promise");
const strings = require("../strings/strings");

async function getPublicChannels(bot) {
  let response;
  try {
    response = await request({
      url: "https://slack.com/api/conversations.list",
      qs: {
        token: bot.token,
        exclude_archived: true,
        types: "public_channel"
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      json: true,
      method: "GET"
    });
  } catch (error) {
    throw error;
  }
  if (!response.ok) {
    throw new Error(response.error);
  }
  return response.channels;
}

async function getUsers(bot) {
  let response;
  try {
    response = await request({
      url: "https://slack.com/api/users.list",
      qs: {
        token: bot.token
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      json: true,
      method: "GET"
    });
  } catch (error) {
    throw error;
  }
  if (!response.ok) {
    throw new Error(response.error);
  }
  return response.members;
}

async function messageUser(bot, user) {
  let response;
  try {
    response = await request({
      url: "https://slack.com/api/im.open",
      qs: {
        token: bot.token,
        user: user.id
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      json: true,
      method: "POST"
    });
  } catch (error) {
    throw error;
  }
  if (!response.ok) {
    return null;
  }
  return response.channel;
}

async function postMessage(alias, text, channelId, bot) {
  let response;
  try {
    response = await request({
      url: "https://slack.com/api/chat.postMessage",
      headers: {
        "content-type": "application/json; charset=utf-8",
        Authorization: `Bearer ${bot.token}`
      },
      body: {
        channel: channelId,
        // if alias is null, it's sent by bot itself
        text:
          alias === null ? text : printf(strings.ANONYMOUS_MESSAGE, alias, text)
      },
      json: true,
      method: "POST"
    });
  } catch (error) {
    throw error;
  }
  if (response.ok) {
    return;
  }
  if (response.error === "channel_not_found") {
    // TODO
  }
  return response.error;
}

module.exports = {
  getUsers,
  messageUser,
  postMessage,
  getPublicChannels
};
