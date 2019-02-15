const request = require("request-promise");

async function getUsers(bot) {
  let response;
  try {
    response = await request({
      url: "https://slack.com/api/users.list",
      qs: {
        token: bot.token
      },
      headers: [
        {
          name: "content-type",
          value: "application/x-www-form-urlencoded"
        }
      ],
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
      headers: [
        {
          name: "content-type",
          value: "application/x-www-form-urlencoded"
        }
      ],
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

module.exports = {
  getUsers,
  messageUser
};
