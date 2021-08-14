const { login, getWANStatus, getOnlineHosts } = require("./mercury");
const { setUnion, setIntersection, setDifference } = require("../lib/misc");

const MAC_WHITELIST = new Set([
  "00-95-69-92-e5-1e", //CS-C2C-Camera
  "48-0f-cf-5d-97-f9", //hp400g1-lan
  "6c-19-8f-b6-44-fe", //hp400g1-wifi
  "7c-c3-a1-9d-84-b7", //Mius-iMac
  "9c-b6-54-a9-03-57", //N54L
  "b0-59-47-9b-fc-df", //360_CAMERA
  "b8-27-eb-74-f2-6c", //N1WiFi
  "b8-e8-56-48-a9-68", //Xiaokes-Mac
  "ca-2f-72-86-8d-9d", //N1LAN
  "f6-b8-86-bc-22-b9", //T1BoxLAN
  "f8-46-1c-07-22-e6", //PS4LAN
]);

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

let gMacSet = new Set();
let gHosts = [];

async function check() {
  let hosts = (await getOnlineHosts()) || [];
  if (!hosts || hosts.length === 0) {
    console.log("check: failed to get online hosts");
    return;
  }
  console.log(`check: online hosts ${gHosts.length} => ${hosts.length}`);
  let macSet = new Set(hosts.map((it) => it["mac"]));
  if (gHosts && gHosts.length > 0) {
    const upmac = diffSet(macSet, gMacSet);
    const downmac = diffSet(gMacSet, macSet);
    (upmac.size > 0 || downmac.size > 0) &&
      console.log("check:", upmac, downmac);
    // const allHosts = Array.from(new Set([...hosts, ...gHosts]));
    let upHosts = hosts.filter((it) => upmac.has(it["mac"]));
    let downHosts = gHosts.filter((it) => downmac.has(it["mac"]));
    upHosts.length > 0 && console.log("UP:", upHosts);
    downHosts.length > 0 && console.log("DOWN:", downHosts);
    upHosts = upHosts.filter((it) => MAC_WHITELIST.has(it["mac"]));
    downHosts = downHosts.filter((it) => MAC_WHITELIST.has(it["mac"]));
    upHosts.length > 0 && console.log("Connected:", upHosts);
    downHosts.length > 0 && console.log("Disconnected:", downHosts);
  }
  if (hosts && hosts.length > 0) {
    gMacSet = macSet;
    gHosts = hosts;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function test() {
  while (true) {
    check();
    await sleep(5000);
  }
  //   let a = new Set([1, 2, 3, 4, 5, 6]);
  //   let b = new Set([1, 3, 5, 7]);
  //   let c = new Set([2, 4, 6, 8]);
  //   let d = new Set([2, 4]);
  //   console.log(diffSet(a, b));
  //   console.log(diffSet(b, a));
  //   console.log(diffSet(a, c));
  //   console.log(diffSet(c, a));
  //   console.log(diffSet(a, d));
  //   console.log(diffSet(d, a));
  //   console.log(diffSet(c, d));
  //   console.log(diffSet(d, c));
}

// check();
test();
