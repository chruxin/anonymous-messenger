const request = require("request-promise");
const parser = require("./parser");

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
    throw new Error(response.error)
  }
  return parser.parseUsers(response.members);
}

module.exports = {
  getUsers
};
