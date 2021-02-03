const chai = require("chai");
const expect = chai.expect;
const dirtyChai = require("dirty-chai");
const chaiAsPromised = require("chai-as-promised");
const sinon = require("sinon");
const { BufferReadableMock, BufferWritableMock } = require("stream-mock");
const lookup = require("../../commands/lookup");
const CredentialManager = require("../../lib/credential-manager");
const Twitter = require("../../lib/twitter");
const { WriteStream } = require("fs-extra");

chai.use(chaiAsPromised);
chai.use(dirtyChai);

describe("The lookup module", () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  context("Users", () => {
    beforeEach(() => {
      sandbox
        .stub(CredentialManager.prototype, "getKeyAndSecret")
        .resolves(["key", "secret"]);
      sandbox.stub(Twitter.prototype, "get").callsFake((url) => {
        let response = url
          .slice(url.indexOf("=") + 1)
          .split(",")
          .map((n) => ({ screen_name: n }));
        return Promise.resolve(response);
      });
    });
    it("Should lookup users piped to stdin", (done) => {
      let stdin = new BufferReadableMock(["foo\n", "bar\n"]);
      let stdout = new BufferWritableMock();
      lookup.users("twine-test", null, { stdin, stdout });
      stdout.on("finish", () => {
        expect(JSON.parse(stdout.data)).to.deep.equal([
          { screen_name: "foo" },
          { screen_name: "bar" },
        ]);
      });
      done();
    });
    it("Should lookup more than 100 users piped to stdin", (done) => {
      let users = [...Array(101).keys()].map((n) => `foo${n}`);
      let stdin = new BufferReadableMock(
        users.map((u) => `${u}\n`),
        { objectMode: true }
      );
      let stdout = new BufferWritableMock();
      lookup.users("twine-test", null, { stdin, stdout });
      stdout.on("finish", () => {
        expect(JSON.parse(stdout.data)).to.deep.equal(
          users.map((u) => ({ screen_name: u }))
        );
      });
      done();
    });
    it("Should lokup users on the command line", (done) => {
      let stdout = new BufferWritableMock();
      lookup.users("twine-test", "foo,bar", { stdout });
      stdout.on("finish", () => {
        expect(JSON.parse(stdout.data)).to.deep.equal([
          { screen_name: "foo" },
          { screen_name: "bar" },
        ]);
      });
      done();
    });
    it("Should reject on error", async () => {
      Twitter.prototype.get.restore();
      sandbox.stub(Twitter.prototype, "get").rejects(new Error("Test Error"));
      let stdout = new BufferWritableMock();
      await expect(
        lookup.users("twine-test", "foo", { stdout })
      ).to.be.rejectedWith("Test Error");
    });
  });
  afterEach(() => {
    sandbox.restore();
  });
});
