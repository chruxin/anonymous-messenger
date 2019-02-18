const requests = require("../slack/requests");
const parser = require("../handlers/parser");
const common = require("../slack/common");
const Conversation = require("../models/conversation");

class Bot {
  constructor(clientId, clientSecret, token, signingSecret, veriToken) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.token = token;
    this.signingSecret = signingSecret;
    this.veriToken = veriToken;
  }

  async postToAnonymousChannel(userId, text) {
    // make sure the public channels are up-to-date
    await common.updatePublicChannels(this);
    // make sure the channel to post is up-to-date
    const channel = await common.updateChannelToPost();
    const alias = await common.getAlias(userId);
    return await requests.postMessage(alias, text, channel.id, this);
  }

  async getPublicChannels() {
    const channels = await requests.getPublicChannels(this);
    const pubChannels = parser.parsePublicChannels(channels);
    return pubChannels;
  }

  async getUsers() {
    const users = await requests.getUsers(this);
    return parser.parseUsers(users);
  }

  async openIMs(users) {
    const promises = [];
    for (const user of users) {
      promises.push(requests.messageUser(this, user));
    }
    const chats = await Promise.all(promises);
    return parser.parseIMs(chats);
  }
}

module.exports = Bot;
