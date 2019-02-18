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

async function openIM(bot, user) {
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

async function postMessage(alias, text, attachment, channelId, bot) {
  const reqBody = {
    channel: channelId,
    // if alias is null, it's sent by bot itself
    text: alias === null ? text : printf(strings.ANONYMOUS_MESSAGE, alias, text)
  };
  if (attachment !== null) {
    reqBody.attachments = attachment;
  }

  let response;
  try {
    response = await request({
      url: "https://slack.com/api/chat.postMessage",
      headers: {
        "content-type": "application/json; charset=utf-8",
        Authorization: `Bearer ${bot.token}`
      },
      body: reqBody,
      json: true,
      method: "POST"
    });
  } catch (error) {
    throw error;
  }
  if (response.ok) {
    return;
  }
  console.error(`Error posting message: ${response.error}`);
  return response.error;
}

async function openDialog(token, qs) {
  let response;
  console.log("open dialog");
  try {
    response = await request({
      url: "https://slack.com/api/dialog.open",
      headers: {
        "content-type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`
      },
      body: qs,
      json: true,
      method: "POST"
    });
  } catch (error) {
    throw error;
  }
  console.log(response);
}

module.exports = {
  getUsers,
  openDialog,
  openIM,
  postMessage,
  getPublicChannels
};
