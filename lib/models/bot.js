const requests = require("../slack/requests");
const parser = require("../handlers/parser");
const conv = require("./conversation");
const Conversation = conv.Conversation;

class Bot {
  constructor(client_id, client_secret, token, signing_secret, veriToken) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.token = token;
    this.signing_secret = signing_secret;
    this.veriToken = veriToken;
  }

  async postToAnonymousChannel(userId, text) {
    let channel = await Conversation.findOne({
      type: "public_channel",
      post: true
    });
    if (channel === null) {
      const channels = await this.getPublicChannels();
      let channelToPost = conv.pickChannel(channels);
      // update the db with the new list of channels
      for (const ch of channels) {
        let dbCh = await Conversation.findOne({
          id: ch.id,
          type: "public_channel"
        });
        if (dbCh === null) {
          dbCh = new Conversation({
            id: ch.id,
            type: "public_channel",
            name: ch.name
          });
        } else {
          dbCh.name = ch.name;
        }

        if (ch.id === channelToPost.id) {
          dbCh.post = true;
          channel = dbCh;
        }
        await dbCh.save();
      }
    }
    await await requests.postMessage(userId, text, channel.id, this);
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
