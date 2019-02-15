// Slash command.

function command(req, res) {
  res.send("Your ngrok tunnel is up and running!");
}

module.exports = {
  command
};
