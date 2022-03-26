const toad = require("toad-scheduler");
const util = require("util");
const dayjs = require("dayjs");
const { log, loge, sleep } = require("../lib/helper");
const { sendTG, sendWX } = require("../lib/net");
const api = require("./api");
const config = require("dotenv").config();
const DEBUG = process.env.DEBUG;
if (DEBUG) {
  console.log(config);
}

log(process.env.MIHOYO_UID);
log(process.env.MIHOYO_COOKIE);

let lastData = {};

async function userResinCheck(uid, cookie) {
  const lastResinNum = lastData["current_resin"] || 0;
  //   if (lastResinNum < 140) {
  //     log("resinCheck: ignore resin<140");
  //     return;
  //   }
  try {
    let data = (await api.getDailyNote(uid, cookie)) || {};
    log("resinCheck:data:", data);
    if (!data || data["retcode"] !== 0) {
      loge("resinCheck:error: no data, ", data["retcode"], data["message"]);
      return;
    }
    lastData = data;
    data = data["data"] || {};
    const resinNum = data["current_resin"] || 0;
    const taskNum = data["finished_task_num"] || 0;
    const homeCoin = data["current_home_coin"] || 0;
    log(
      `resinCheck: resinNum=${resinNum} taskNum=${taskNum} homeCoin=${homeCoin}`
    );
    let shouldRemind = false;
    let resinRecSecs = parseInt(data["resin_recovery_time"]) || 0;
    let resinRecMin = Math.ceil(resinRecSecs / 60);
    let resinRecStr = ` （${Math.floor(resinRecMin / 60)}小时${
      resinRecMin % 60
    }分后回满）`;
    let coinRecSecs = parseInt(data["home_coin_recovery_time"]) || 0;
    let coinRecMin = Math.ceil(coinRecSecs / 60);
    let coinRecStr = ` （${Math.floor(coinRecMin / 60)}小时${
      coinRecMin % 60
    }分后回满）`;
    let content = "";
    content += `\n★ 原粹树脂： ${data["current_resin"]}/${data["max_resin"]}`;
    content += resinRecStr;
    content += `\n★ 洞天宝钱： ${data["current_home_coin"]}/${data["max_home_coin"]}`;
    content += coinRecStr;
    content += `\n★ 每日委托任务： ${data["finished_task_num"]}/${data["total_task_num"]}`;
    if (
      data["finished_task_num"] >= data["total_task_num"] &&
      data["is_extra_task_reward_received"]
    ) {
      content += " （今日奖励已领取）";
    }
    content += "\n";
    if (data["current_resin"] > data["max_resin"] - 20) {
      content += "\n★ 注意：原粹树脂快要满了！";
      shouldRemind = true;
    }
    if (data["current_home_coin"] > data["max_home_coin"] - 200) {
      content += "\n★ 注意：洞天宝钱快要满了！";
      shouldRemind = true;
    }
    if (data["finished_task_num"] < data["total_task_num"]) {
      content += "\n★ 注意：每日委托没有完成！";
      //   shouldRemind = true;
    }
    if (data["remain_resin_discount_num"] > 0) {
      content += "\n★ 注意：减半周本没有完成！";
      //   shouldRemind = true;
    }
    content += "\n";
    const title = "原神实时便签 " + dayjs(Date.now()).format("YYYY-MM-DD");
    const now = dayjs();
    if (now.hour() === 10 || now.hour() === 23) {
      // remind on morning and night
      // shouldRemind = true;
    }
    if (DEBUG) {
      shouldRemind = true;
    }
    if (shouldRemind) {
      await sleep(1000);
      await sendWX(title, content);
      await sleep(1000);
      await sendTG(title, content);
    }
  } catch (err) {
    loge("resinCheck:error:", err);
  }
}

async function resinCheck() {
  const uid = process.env.MIHOYO_UID;
  const cookie = process.env.MIHOYO_COOKIE;
  await userResinCheck(uid, cookie);
}

async function main(intervalSecs = 1800) {
  // run on every one hour
  if (process.platform.includes("win")) {
    // for dev
    intervalSecs = 60;
  }
  const scheduler = new toad.ToadScheduler();
  const task = new toad.AsyncTask("resinCheck", resinCheck, (err) => {
    loge("task:resinCheck:", err);
  });
  const job = new toad.SimpleIntervalJob(
    { seconds: intervalSecs, runImmediately: true },
    task
  );
  scheduler.addSimpleIntervalJob(job);
  log("task:resinCheck: scheduled task started!");
}

main();
