const { setBaseUrl, smsSend } = require("./benton");

async function main() {
  if (process.platform.includes("win")) {
    setBaseUrl("http://lte.mcxiaoke.com");
  }
  await smsSend("10682472766", "T");
}

main();
