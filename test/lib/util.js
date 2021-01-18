const chai = require("chai");
const expect = chai.expect;
// const dirtyChai = require("dirty-chai")
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
});
