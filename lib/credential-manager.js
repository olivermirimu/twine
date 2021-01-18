const ConfigStore = require("configstore");
const keytar = require("keytar");

class CredentialManager {
  constructor(name) {
    this.conf = new ConfigStore(name);
    this.service = name;
  }
  async getKeyAndSecret(prop) {
    let key = this.conf.get(prop);
    if (!key) {
      throw new Error("API Key not found");
    } else {
      let secret = await keytar.getPassword(this.service, key);
      console.log();
      return [key, secret];
    }
  }

  async storeKeyAndSecret(prop, key, secret) {
    this.conf.set(prop, key);
    await keytar.setPassword(this.service, key, secret);
  }

  async clearKeyAndSecret(prop) {
    let key = this.conf.get(prop);
    this.conf.delete(prop);
    await keytar.deletePassword(this.service, key);
  }
}

module.exports = CredentialManager;
