const path = require("path");
const fs = require("fs-extra");
const dayjs = require("dayjs");
const toad = require("toad-scheduler");
const helper = require("../lib/helper");
const { log, loge, sleep, humanTime } = helper;
const { sendTG, sendWX } = require("../lib/net");
const { getWANStatus, getOnlineHosts } = require("./mercury");

const BOOT_TIME = Date.now();
let gTaskCount = 0;
let gMacSet = new Set();
let gHosts = [];
let gLastChanged = {};

const toS = (v) => "{" + Object.values(v).join(",") + "}";

function strObj(o) {
  if (Array.isArray(o)) {
    return o.map((v) => toS(v)).join("|");
  } else if (typeof o === "object") {
    return toS(o);
  } else {
    return o;
  }
}

/**
 * difference element: setA - setB
 * @param {*} setA Set A
 * @param {*} setB Set B
 * @returns in A, not in B
 */
function diffSet(setA, setB) {
  let _difference = new Set(setA);
  for (let elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

async function filelog(...args) {
  const timestamp = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
  args.unshift({ t: timestamp });
  const logdir = path.join(__dirname, "logs");
  if (!(await fs.pathExists(logdir))) {
    await fs.mkdirp(logdir);
  }
  const dt = dayjs(new Date()).format("YYYYMM");
  const logfile = path.join(logdir, `monitor-log-${dt}.txt`);
  try {
    await fs.appendFile(logfile, JSON.stringify(args) + "\n");
  } catch (error) {
    loge("filelog: failed to write log file", error);
  }
}

const strDate = (d) => dayjs(d).format("YYYY-MM-DD HH:mm:ss");

async function sendReport(upHosts, downHosts) {
  upHosts = upHosts || {};
  downHosts = downHosts || {};
  for (const h of upHosts) {
    await sleep(1000);
    const title = `Device Online: ${h.hostname || h.ip}`;
    const desp = `Name: ${h.hostname} \nIP: ${h.ip} \nMAC: ${
      h.mac
    } \nTime: ${strDate(h.date)}`;
    await sendTG(title, desp);
    await sendWX(title, desp);
  }
  for (const h of downHosts) {
    await sleep(1000);
    const title = `Device Offline: ${h.hostname || h.ip}`;
    const desp = `Name: ${h.hostname} \nIP: ${h.ip} \nMAC: ${
      h.mac
    } \nTime: ${strDate(h.date)}`;
    await sendTG(title, desp);
    await sendWX(title, desp);
  }
}

async function check() {
  ++gTaskCount;
  let hosts = (await getOnlineHosts()) || [];
  if (!hosts || hosts.length === 0) {
    log("check: failed to get online hosts");
    return;
  }
  const jsonConfig = require("../lib/private.json")["APP_WHITELIST"];
  WHITELIST = new Set(jsonConfig);
  log(
    `check(${gTaskCount}): online hosts ${gHosts.length} => ${hosts.length} up time:`,
    humanTime(BOOT_TIME)
  );
  let macSet = new Set(hosts.map((it) => it["mac"]));
  // keep old data
  const oldMacSet = gMacSet;
  const oldHosts = gHosts;
  // update old data
  gMacSet = macSet;
  gHosts = hosts;

  if (!oldHosts || oldHosts.length == 0) {
    // first time init, ignore compare hosts
    return;
  }

  const upMac = diffSet(macSet, oldMacSet);
  const downMac = diffSet(oldMacSet, macSet);
  let upHosts = hosts.filter((it) => upMac.has(it["mac"]));
  let downHosts = oldHosts.filter((it) => downMac.has(it["mac"]));
  if (upHosts.length == 0 && downHosts.length == 0) {
    return;
  }
  log("check:", "up:", strObj(upHosts), "down:", strObj(downHosts));

  if (WHITELIST && WHITELIST.size > 0) {
    upHosts = upHosts.filter((it) => WHITELIST.has(it["mac"]));
    downHosts = downHosts.filter((it) => WHITELIST.has(it["mac"]));
  }

  if (upHosts.length == 0 && downHosts.length == 0) {
    return;
  }
  log("Online:", upHosts, "Offline:", downHosts);
  gLastChanged = { up: upHosts, down: downHosts };
  await filelog(gLastChanged);
  await sendReport(upHosts, downHosts);
}

async function main(intervalSecs = 20) {
  const scheduler = new toad.ToadScheduler();
  const task = new toad.AsyncTask("check", check, (err) => {
    loge("check:", err);
  });
  const job = new toad.SimpleIntervalJob({ seconds: intervalSecs }, task);
  scheduler.addSimpleIntervalJob(job);
  log("check scheduled task started!");
}

main();

async function test() {
  await sendTG("hello", "this is a message");
}

// test();
