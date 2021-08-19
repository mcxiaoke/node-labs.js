const config = require("dotenv").config();
const DEBUG = process.env.DEBUG;
if (DEBUG) {
  console.log(config);
}
const { sendWX, sendTG } = require("./lib/net");

async function main() {
  await sendWX("test main", " hello this is a mesage");
}

main();
