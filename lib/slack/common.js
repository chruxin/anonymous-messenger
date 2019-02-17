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

module.exports = {
  pickChannel
};
