const crypto = require("crypto");

// verify the request came from slack
function verifySlack(req, bot) {
  const timestamp = req.get("x-slack-request-timestamp");
  if (Math.abs(Date.now() / 1000 - timestamp) > 60 * 5) {
    // if more than 5 mins, could be a relay attach, ignore
    return false;
  }
  const versionNum = "v0";
  const sigBaseStr = `${versionNum}:${timestamp}:${req.body}`;
  const sig = crypto
    .createHmac("sha256", bot.signingSecret)
    .update(sigBaseStr)
    .digest("hex");

  return `${versionNum}=${sig}` === req.get("X-Slack-Signature");
}

module.exports = verifySlack;
