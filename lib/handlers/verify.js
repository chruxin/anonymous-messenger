const crypto = require("crypto");
const timingSafeCompare = require("tsscmp");

// verify the request came from slack
// source: https://github.com/slackapi/template-slash-command-and-dialogs/blob/master/src/verifySignature.js
function verifySlack(req, bot) {
  const signature = req.headers["x-slack-signature"];
  const timestamp = req.headers["x-slack-request-timestamp"];
  const hmac = crypto.createHmac("sha256", bot.signingSecret);
  const [version, hash] = signature.split("=");

  // Check if the timestamp is too old
  const fiveMinutesAgo = ~~(Date.now() / 1000) - 60 * 5;
  if (timestamp < fiveMinutesAgo) return false;

  hmac.update(`${version}:${timestamp}:${req.rawBody}`);

  // check that the request signature matches expected value
  return timingSafeCompare(hmac.digest("hex"), hash);
}

module.exports = verifySlack;
