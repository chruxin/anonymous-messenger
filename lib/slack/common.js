const Conversation = require("../models/conversation");

// pick a public channel to send the anonymous messages
function pickChannel(channels) {
  if (channels.length === 0) {
    throw new Error("No public channel.");
  }
  // pick anonymous if it exists
  let loc = channels.filter(channel => channel.name === "anonymous");
  if (loc.length > 0) {
    return loc[0];
  }
  // otherwise, pick random
  loc = channels.filter(channel => channel.name === "random");
  if (loc.length > 0) {
    return loc[0];
  }
  // just pick the first one if none of the above is available
  return channels[0];
}

async function updatePublicChannels(bot) {
  const channels = await bot.getPublicChannels();
  const promises = [];
  for (const channel of channels) {
    let dbCh = await Conversation.findOne({
      id: channel.id,
      type: "public_channel",
      name: channel.name
    });
    if (dbCh === null) {
      dbCh = new Conversation({
        id: channel.id,
        type: "public_channel",
        name: channel.name
      });
      promises.push(dbCh.save());
    }
  }
  await Promise.all(promises);
}

async function updateChannelToPost() {
  let channel = await Conversation.findOne({
    type: "public_channel",
    post: true
  });
  if (channel === null) {
    const channels = await Conversation.find({ type: "public_channel" });
    channel = pickChannel(channels);
    await Conversation.findOneAndUpdate({ id: channel.id }, { post: true });
  }
  return channel;
}

module.exports = {
  pickChannel,
  updatePublicChannels,
  updateChannelToPost
};
