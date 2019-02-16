const user = require("../models/user");

// members is a list of users
function parseUsers(members) {
  return members
    .filter(member => !member.deleted)
    .map(member => new user.User(member.id));
}

function parseChats(chats) {
  return chats.filter(chat => chat !== null && chat !== undefined);
}

// body is a string of the format KEY=VALUE&KEY1=VALUE1
function parseRequestBody(body) {
  const parts = body.split("&");
  const result = {};
  for (const part of parts) {
    const kv = part.split("=");
    result[kv[0]] = kv[1];
  }
  return result;
}

module.exports = {
  parseUsers,
  parseChats,
  parseRequestBody
};
