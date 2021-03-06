const toad = require("toad-scheduler");
const { log, loge } = require("../lib/helper");
const { lanCheck } = require("./lan");

async function main(intervalSecs = 300) {
  if (process.platform.includes("win")) {
    // for dev
    intervalSecs = 10;
  }
  const scheduler = new toad.ToadScheduler();
  const task = new toad.AsyncTask("lanCheck", lanCheck, (err) => {
    loge("lanCheck:", err);
  });
  const job = new toad.SimpleIntervalJob(
    { seconds: intervalSecs, runImmediately: true },
    task
  );
  scheduler.addSimpleIntervalJob(job);
  log("lanCheck: scheduled task started!");
}

main();
