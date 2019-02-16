const requests = require("../slack/requests");
const parser = require("../handlers/parser");

class Bot {
  constructor(client_id, client_scret, token, signing_secret) {
    this.client_id = client_id;
    this.client_scret = client_scret;
    this.token = token;
    this.signing_secret = signing_secret;
  }

  async getUsers() {
    const users = await requests.getUsers(this);
    return parser.parseUsers(users);
  }

  async openDMs(users) {
    const promises = [];
    for (const user of users) {
      promises.push(requests.messageUser(this, user));
    }
    const chats = await Promise.all(promises);
    return parser.parseChats(chats);
  }
}

module.exports = {
  Bot
};
