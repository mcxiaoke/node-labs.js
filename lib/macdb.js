const fs = require("fs-extra");
const data = require("./data/manuf_map.json");
const gManufMap = new Map(Object.entries(data));

const skipList = ["shenzhen", "beijing", "shanghai", "hangzhou", "zhejiang"];
function normalizeLabel(label, manuf) {
  if (!label) {
    return "Unknown";
  }
  const lb = label.trim().toLowerCase();
  let lb2;
  for (const s of skipList) {
    if (lb.includes(s)) {
      // console.log(manuf.slice(1, 3).join(" ") || label, ":", manuf.join(" "));
      lb2 = manuf.slice(1, 3).join(" ") || label;
      break;
    }
  }
  if (!lb2) {
    lb2 = manuf.slice(0, 2).join(" ") || label;
    // console.log(label, ":", lb2, ":", manuf);
  }
  return lb2;
}

async function saveManuf() {
  const data = await fs.readFile("./data/manuf", { encoding: "utf8" });
  let lines = data.split("\n");
  console.log(lines.length);
  lines = lines.filter((it) => !it.startsWith("#"));
  console.log(lines.length);
  const list = lines
    .map((line) => {
      const parts = line.split(/\s/);
      let [mac, label, ...manuf] = parts;
      let mack = mac.substring(0, 11).replace(/:/g, "");
      return [
        mack,
        {
          mac: mac,
          label: normalizeLabel(label, manuf),
          label2: label,
          manuf: manuf.join(" "),
        },
      ];
    })
    .filter((it) => it[0] && it[1].mac && it[1].label && it[1].manuf);
  console.log(list.length);
  const map = new Map(list);
  console.log(map.size);
  await fs.writeJSON("./data/manuf_list.json", list, { spaces: 2 });
  await fs.writeJSON("./data/manuf_map.json", Object.fromEntries(map), {
    spaces: 2,
  });
}

function queryMacManuf(mac) {
  const k = mac.replace(/[:-]/g, "").toUpperCase().substring(0, 8);
  const o = gManufMap.get(k) || gManufMap.get(k.substring(0, 6));
  return o || {};
}

async function test() {
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  // await saveManuf();
  const jd = await fs.readJSON("./lib/private.json");
  const sp = jd["APP_WHITELIST"];
  for (const s of sp) {
    console.log(s, queryMacManuf(s));
  }
  await sleep(30 * 1000);
}

test();
