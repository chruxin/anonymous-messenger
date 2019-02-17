const request = require("request-promise");

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

// if user_id is null, it's sent by bot itself
async function postMessage(user_id, text, channel_id, bot) {
  let response;
  try {
    response = await request({
      url: "https://slack.com/api/chat.postMessage",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${bot.token}`
      },
      body: {
        channel: channel_id,
        text: text
      },
      json: true,
      method: "POST"
    });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getUsers,
  messageUser,
  postMessage,
  getPublicChannels
};