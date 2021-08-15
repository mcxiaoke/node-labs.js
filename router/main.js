const toad = require("toad-scheduler");
const { log, loge } = require("../lib/helper");
const { lanCheck } = require("./lan");

async function main(intervalSecs = 120) {
  if (process.platform.includes("win")) {
    // for dev
    intervalSecs = 10;
  }
  const scheduler = new toad.ToadScheduler();
  const task = new toad.AsyncTask("lanCheck", lanCheck, (err) => {
    loge("lanCheck:", err);
  });
  const job = new toad.SimpleIntervalJob({ seconds: intervalSecs }, task);
  scheduler.addSimpleIntervalJob(job);
  log("lanCheck: scheduled task started!");
}

main();
