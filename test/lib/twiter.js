const axios = require("axios");
const chai = require("chai");
const sinon = require("sinon");
const dirtyChai = require("dirty-chai");
const chaiAsPromised = require("chai-as-promised");
const { before } = require("mocha");
const { expect } = chai;
const Twitter = require("../../lib/twitter");

chai.use(chaiAsPromised);
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
    axios.get.restore();
  });
  it("Should invoke POST APIs", async () => {
    sandbox.stub(axios, "post").resolves({ data: "bar" });
    let response = await twitter.post("/api", "stuff");
    expect(response).to.equal("bar");
    axios.post.restore();
  });
  it("Should reject on invalid credentials", async () => {
    sinon.stub(axios, "post").rejects(new Error("401"));
    await expect(twitter.post("/api", "stuff")).to.be.rejectedWith(
      "Invalid Twitter credentials"
    );
    axios.post.restore();
    sinon.stub(axios, "get").rejects(new Error("401"));
    await expect(twitter.get("/api")).to.be.rejectedWith(
      "Invalid Twitter credentials"
    );
    axios.get.restore();
  });
  it("Should reject on rate limit", async () => {
    sinon.stub(axios, "post").rejects(new Error("429"));
    await expect(twitter.post("/api", "stuff")).to.be.rejectedWith(
      "Twitter rate limit reached"
    );
    axios.post.restore();
    sinon.stub(axios, "get").rejects(new Error("429"));
    await expect(twitter.get("/api")).to.be.rejectedWith(
      "Twitter rate limit reached"
    );
    axios.get.restore();
  });
  it("Should reject on other errors", async () => {
    sinon.stub(axios, "post").rejects(new Error("foo"));
    await expect(twitter.post("/api", "stuff")).to.be.rejectedWith("Twitter:");
    axios.post.restore();
    sinon.stub(axios, "get").rejects(new Error("foo"));
    await expect(twitter.get("/api")).to.be.rejectedWith("Twitter:");
    axios.get.restore();
  });
});
