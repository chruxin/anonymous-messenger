const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema({
  id: String,
  name: String,
  type: {
    type: String,
    enum: ["public_channel", "private_channel", "mpim", "im"]
  },
  // is it the public channel to post anonymous messages?
  post: Boolean
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
