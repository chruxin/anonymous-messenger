const user = require("../models/user");
const conversation = require("../models/conversation");

// members is a list of users
function parseUsers(members) {
  return members
    .filter(member => !member.deleted)
    .map(member => new user.User(member.id));
}

function parseDMs(chats) {
  return chats
    .filter(chat => chat !== null && chat !== undefined)
    .map(chat => new conversation.DM(chat.id));
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

function parsePublicChannels(channels) {
  return channels.map(
    channel => new conversation.PublicChannel(channel.id, channel.name)
  );
}

module.exports = {
  parseUsers,
  parseDMs,
  parseRequestBody,
  parsePublicChannels
};
