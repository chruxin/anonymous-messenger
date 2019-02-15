const user = require("./user");

// members is a list of users
function parseUsers(members) {
  return members
    .filter(member => !member.deleted)
    .map(member => new user.User(member.id));
}

function parseChats(chats) {
  return chats.filter(chat => chat !== null && chat !== undefined);
}

module.exports = {
  parseUsers,
  parseChats
};
