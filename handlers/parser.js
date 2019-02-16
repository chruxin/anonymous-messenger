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

function parsePublicChannels(channels) {
  return channels.map(
    channel => new conversation.PublicChannel(channel.id, channel.name)
  );
}

module.exports = {
  parseUsers,
  parseDMs,
  parsePublicChannels
};
