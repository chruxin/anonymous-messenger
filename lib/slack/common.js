const Conversation = require("../models/conversation");
const User = require("../models/user");
const generate = require("project-name-generator");

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
  try {
    const publicChannels = await bot.getPublicChannels();
    const pubChIds = publicChannels.map(channel => channel.id);
    const promises = [];
    const dbPublicChannels = await Conversation.find({
      type: "public_channel"
    });
    dbPublicChannels
      .filter(dbPubCh => !pubChIds.includes(dbPubCh.id))
      .forEach(toBeDeletedDBPubCh => {
        promises.push(toBeDeletedDBPubCh.remove());
      });
    for (const channel of publicChannels) {
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
  } catch (error) {
    console.error(`Error updating public channels in the database: ${error}`);
  }
}

async function updateChannelToPost() {
  try {
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
  } catch (error) {
    console.error(`Error updating channel to post in the database: ${error}`);
  }
}

function capitalize(str) {
  if (typeof str !== "string") {
    return;
  }
  if (str.length <= 1) {
    return str.toUpperCase();
  }
  return `${str[0].toUpperCase()}${str.substr(1)}`;
}

async function getAlias(userId) {
  try {
    let user = await User.findOne({ id: userId });
    if (user === null) {
      user = new User({ id: userId });
    }
    let newAlias;
    if (user.alias === undefined) {
      while (true) {
        newAlias = generate()
          .raw.map(word => capitalize(word))
          .join(" ");
        let tempUser = await User.findOne({ alias: newAlias });
        if (tempUser === null) {
          // alias not taken
          break;
        }
      }
      user.alias = newAlias;
      await user.save();
    }
    return user.alias;
  } catch (error) {
    console.error(`Error retrieving/generating alias for user: ${error}`);
  }
}

async function updateUsers(bot) {
  try {
    const users = await bot.getUsers();
    const userIds = users.map(user => user.id);
    const dbUsers = await User.find({});
    const promises = [];
    dbUsers
      .filter(dbUser => !userIds.includes(dbUser.id))
      .forEach(toBeDeletedDBUser => {
        promises.push(toBeDeletedDBUser.remove());
      });

    for (const userId of userIds) {
      let dbUser = await User.findOne({ id: userId });
      if (dbUser === null) {
        dbUser = new User({ id: userId });
        promises.push(dbUser.save());
      }
    }
    await Promise.all(promises);
    return users;
  } catch (error) {
    console.log(`Error updating users in the database: ${error}`);
  }
}

module.exports = {
  getAlias,
  pickChannel,
  updatePublicChannels,
  updateChannelToPost,
  updateUsers
};
