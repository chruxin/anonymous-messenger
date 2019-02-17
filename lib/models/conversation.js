class Conversation {
  constructor(id) {
    this.id = id;
  }
}

class PublicChannel extends Conversation {
  constructor(id, name) {
    super(id);
    this.name = name;
  }
}

class DM extends Conversation {
  constructor(id) {
    super(id);
  }
}

module.exports = {
  DM,
  PublicChannel
};
