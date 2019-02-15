const requests = require('./slack/requests')

class Bot {
  constructor(client_id, client_scret, token) {
    this.client_id = client_id;
    this.client_scret = client_scret;
    this.token = token;
  }

  async getUsers() {
    return await requests.getUsers(this);
  }
}

module.exports = {
  Bot
};
