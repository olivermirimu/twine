const chai = require("chai");
const expect = chai.expect;
const fs = require("fs");
const path = require("path");
const dirtyChai = require("dirty-chai");
const chaiAsPromised = require("chai-as-promised");
const inquirer = require("inquirer");
const sinon = require("sinon");
const configure = require("../../commands/configure");
const CredentialManager = require("../../lib/credential-manager");
const Twitter = require("../../lib/twitter");
const util = require("../../lib/util");

chai.use(chaiAsPromised);
chai.use(dirtyChai);
describe("The configure module", () => {
  let creds, sandbox;
  before(() => {
    creds = new CredentialManager("twine-test");
  });
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  it("Should add credentials when none are found", async () => {
    sandbox.stub(inquirer, "prompt").resolves({ key: "one", secret: "two" });
    await configure.consumer("twine-test");
    let [key, secret] = await creds.getKeyAndSecret("apiKey");
    expect(key).to.equal("one");
    expect(secret).to.equal("two");
  });
  it("Should replace existing credentials", async () => {
    sandbox.stub(inquirer, "prompt").resolves({ key: "three", secret: "four" });
    await configure.consumer("twine-test");
    let [key, secret] = await creds.getKeyAndSecret("apiKey");
    expect(key).to.equal("three");
    expect(secret).to.equal("four");
    expect(inquirer.prompt.calledOnce).to.be.true;
  });
  it("Should add an account", async () => {
    sandbox
      .stub(CredentialManager.prototype, "getKeyAndSecret")
      .resolves(["key", "secret"]);
    sandbox
      .stub(Twitter.prototype, "post")
      .onFirstCall()
      .resolves("oauth_token=abc&oauth_token_secret=def")
      .onSecondCall()
      .resolves("oauth_token=ghi&oauth_token_secret=jkl");
    sandbox.stub(Twitter.prototype, "get").resolves({ screen_name: "foo" });
    sandbox
      .stub(inquirer, "prompt")
      .onFirstCall()
      .resolves({ continue: "" })
      .onSecondCall()
      .resolves({ pin: "1234" });
    sandbox.stub(util, "openBrowser").returns("");
    sandbox.spy(console, "log");

    await configure.account("twine-test");
    CredentialManager.prototype.getKeyAndSecret.restore();

    let [token, secret] = await creds.getKeyAndSecret("accountToken");
    expect(token).to.equal("ghi");
    expect(secret).to.equal("jkl");
    expect(
      console.log.calledWith('Account "foo" succcessfully added')
    ).to.be.true();
  });

  afterEach(() => {
    sandbox.restore();
  });
  after((done) => {
    fs.unlink(
      path.join(process.env.HOME, ".config/configstore/twine-test.json"),
      done
    );
  });
});
