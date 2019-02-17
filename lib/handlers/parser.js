function parseUsers(members) {
  return members
    .filter(member => !member.deleted)
    .map(member => ({ id: member.id }));
}

function parseIMs(chats) {
  return chats
    .filter(chat => chat !== null && chat !== undefined)
    .map(chat => ({ id: chat.id, type: "im" }));
}

function parsePublicChannels(channels) {
  return channels.map(channel => ({
    id: channel.id,
    name: channel.name,
    type: "public_channel"
  }));
}

module.exports = {
  parseUsers,
  parseIMs: parseIMs,
  parsePublicChannels
};
