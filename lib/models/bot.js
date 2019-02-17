const requests = require("../slack/requests");
const parser = require("../handlers/parser");

class Bot {
  constructor(client_id, client_secret, token, signing_secret, veriToken) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.token = token;
    this.signing_secret = signing_secret;
    this.veriToken = veriToken;
  }

  setChannel(channel) {
    this.channelToPost = channel;
  }

  async postToAnonymousChannel(userId, text) {
    await requests.postMessage(userId, text, this.channelToPost.id, this);
  }

  async getPublicChannels() {
    const channels = await requests.getPublicChannels(this);
    const pubChannels = parser.parsePublicChannels(channels);
    this.pubChannels = pubChannels;
    return pubChannels;
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
    return parser.parseDMs(chats);
  }
}

module.exports = Bot;
