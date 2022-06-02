const chai = require("chai");
const expect = chai.expect;
// const dirtyChai = require("dirty-chai")
const sinon = require("sinon");
const util = require("../../lib/util");

describe("The util module", () => {
  context("The notEmpty function", () => {
    it("Should return true when given a string", () => {
      expect(util.notEmpty("foo")).to.be.true();
    });
    it("Should return an error when given an empty string", () => {
      expect(util.notEmpty("")).to.equal("This value is required");
    });
  });
  context("The handleError function", () => {
    it("Should set the exitCode to 1", async () => {
      sinon.stub(console, "error");
      util.handleError("foo");
      expect(process.exitCode).to.equal(1);
      console.error.restore();
    });
    it("should print a message to console.error", async () => {
      sinon.stub(console, "error");
      util.handleError("bar");
      expect(console.error.calledWith("bar"));
      console.error.restore();
    });
  });
});
