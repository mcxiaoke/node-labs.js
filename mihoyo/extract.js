const path = require("path");
const fs = require("fs-extra");

const values = {};

function setVariable(name, value) {
  values[name] = value;
}

function getVariable(name) {
  return values[name];
}

async function parseDailyNote() {
  //   const raw = await fs.readFile("./data/dailynote.json", "utf8");
  const raw = response.body;
  let note = JSON.parse(raw);
  let content = "";
  if (note.retcode === 0) {
    const data = note["data"] || {};
    const resinNum = data["current_resin"] || 0;
    const taskNum = data["finished_task_num"] || 0;
    const homeCoin = data["current_home_coin"] || 0;
    console.log(
      `parseDailyNote: resinNum=${resinNum} taskNum=${taskNum} homeCoin=${homeCoin}`
    );
    content += `原粹树脂：${data["current_resin"]}/${data["max_resin"]}`;
    content += `，洞天宝钱：${data["current_home_coin"]}/${data["max_home_coin"]}`;
    content += `，每日委托：${data["finished_task_num"]}/${data["total_task_num"]}`;
    if (data["is_extra_task_reward_received"]) {
      content += " （已完成）";
    }
  }
  // setVariable("DNM", content);
  showToast(`原神便签：${content}`);
  return content;
}

async function main() {
  const message = await parseDailyNote();
  console.log(message);
}

main();
