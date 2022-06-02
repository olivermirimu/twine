const crypto = require("crypto");
const OAuth = require("oauth-1.0a");
const axios = require("axios");

class Twitter {
  constructor(consumerKey, consumerSecret) {
    this.baseUrl = "https://api.twitter.com/";
    this.token = {};
    let oauth = OAuth({
      consumer: {
        key: consumerKey,
        secret: consumerSecret,
      },
      signature_method: "HMAC-SHA1",
      hash_function(baseString, key) {
        return crypto
          .createHmac("sha1", key)
          .update(baseString)
          .digest("base64");
      },
    });
    axios.interceptors.request.use((config) => {
      config.headers = oauth.toHeader(
        oauth.authorize(
          {
            url: `${config.baseUrl}${config.url}`,
            method: config.method,
            data: config.data,
          },
          this.token
        )
      );
      config.headers["Content-Type"] = "application/x-www-form-urlencoded";
      config.url = `${config.baseUrl}${config.url}`;
      return config;
    });
    axios.defaults.baseUrl = this.baseUrl;
    // console.log("defaults:", axios.defaults);
  }
  setToken(key, secret) {
    this.token = { key, secret };
  }
  async get(api) {
    return axios
      .get(api)
      .then((response) => response.data)
      .catch((err) => handleTwitterError(err));
  }
  async post(api, data) {
    return axios
      .post(api, data)
      .then((response) => {
        return response.data;
      })
      .catch((err) => handleTwitterError(err));
  }
}

function handleTwitterError(error) {
  if (error.message.includes("401")) {
    throw new Error(
      `Invalid Twitter credentials -- try running 'configure' again`
    );
  } else if (error.message.includes("429")) {
    throw new Error(`Twitter rate limit reached -- try again later`);
  } else {
    throw new Error(`Twitter: ${error.message}`);
  }
}
module.exports = Twitter;
