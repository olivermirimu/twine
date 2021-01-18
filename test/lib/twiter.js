const axios = require("axios");
const chai = require("chai");
const sinon = require("sinon");
const dirtyChai = require("dirty-chai");
const { before } = require("mocha");
const { expect } = chai;
const Twitter = require("../../lib/twitter");

// chai.use(chaiAsPromised);
chai.use(dirtyChai);

describe("The twitter module", () => {
  let twitter, sandbox;
  before(() => {
    twitter = new Twitter("key", "secret");
  });
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  it("Should set a token", () => {
    twitter.setToken("abc", "123");
    expect(twitter.token).to.include({ key: "abc" });
    expect(twitter.token).to.include({ secret: "123" });
  });
  it("Should invoke GET APIs", async () => {
    sandbox.stub(axios, "get").resolves({ data: "foo" });
    let response = await twitter.get("/api");
    expect(response).to.equal("foo");
    axios.restore();
  });
  it("Should invoke POST APIs", async () => {
    sandbox.stub(axios, "post").resolves({ data: "bar" });
    let response = twitter.post("/api", "stuff");
    expect(response).to.equal("bar");
    axios.restore();
  });
});
