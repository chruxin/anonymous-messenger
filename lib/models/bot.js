const requests = require("../slack/requests");
const parser = require("../handlers/parser");
const common = require("../slack/common");

class Bot {
  constructor(clientId, clientSecret, token, signingSecret, veriToken) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.token = token;
    this.signingSecret = signingSecret;
    this.veriToken = veriToken;
  }

  async postToAnonymousChannel(userId, text) {
    try {
      // make sure the public channels are up-to-date
      await common.updatePublicChannels(this);
      // make sure the channel to post is up-to-date
      const channel = await common.updateChannelToPost();
      const alias = await common.getAlias(userId);
      return await requests.postMessage(alias, text, channel.id, this);
    } catch (error) {
      console.error(`Error posting anonymously to channel: ${error}`);
    }
  }

  async getPublicChannels() {
    try {
      const channels = await requests.getPublicChannels(this);
      const pubChannels = parser.parsePublicChannels(channels);
      return pubChannels;
    } catch (error) {
      console.error(`Error retrieving and parsing public channels: ${error}`);
    }
  }

  async getUsers() {
    try {
      const users = await requests.getUsers(this);
      return parser.parseUsers(users);
    } catch (error) {
      console.error(`Error retrieving and parsing users: ${error}`);
    }
  }

  async openIMs(users) {
    try {
      const promises = [];
      for (const user of users) {
        promises.push(requests.messageUser(this, user));
      }
      const chats = await Promise.all(promises);
      return parser.parseIMs(chats);
    } catch (error) {
      console.error(`Error opening direct messages with users: ${error}`);
    }
  }
}

module.exports = Bot;
