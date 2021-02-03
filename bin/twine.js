#! /usr/bin/env node

const CredentialManager = require("../lib/credential-manager");
const program = require("commander");
const pkg = require("../package.json");

program
  .version(pkg.version)
  .command("configure", "Configure twitter related credentials")
  .command("lookup", "lookup things on twitter")
  .parse(process.argv);
