const open = require("open");
const chalk = require("chalk");

const notEmpty = (input) => (input === "" ? "This value is required" : true);
const openBrowser = (url) => open(url, { wait: false });
const handleError = (message) => {
  console.log(chalk.redBright(message));
  process.exitCode = 1;
};

module.exports = { notEmpty, openBrowser, handleError };
