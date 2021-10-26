const toad = require("toad-scheduler");
const { log, loge } = require("../lib/helper");
const { smsCheck, setBaseUrl } = require("./benton");

async function main(intervalSecs = 5) {
  // if ((!(await isPortOpen("192.168.4.1")), 80)) {
  if (process.platform.includes("win")) {
    // for dev
    setBaseUrl("http://lte.mcxiaoke.com");
  }
  const scheduler = new toad.ToadScheduler();
  const task = new toad.AsyncTask("smsCheck", smsCheck, (err) => {
    loge("smsCheck:", err);
  });
  const job = new toad.SimpleIntervalJob(
    { seconds: intervalSecs, runImmediately: true },
    task
  );
  scheduler.addSimpleIntervalJob(job);
  log("smsCheck: scheduled task started!");
}

main();
