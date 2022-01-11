const fetch = require("node-fetch");
const { URLSearchParams, URL } = require("url");
const { md5 } = require("pure-md5");
const { log, loge } = require("../lib/helper");

const API_URL = "https://api-takumi.mihoyo.com/game_record/app/genshin/api/";

function randomString(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// https://github.com/Azure99/GenshinPlayerQuery/issues/20
function generateDS(query, body) {
  const salt = "xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs";
  const r = randomString(100000, 200000);
  const t = Math.floor(Date.now() / 1000);
  const q = query ? (qs = new URLSearchParams(query).toString()) : "";
  const b = body ? JSON.stringify(body) : "";
  const str = `salt=${salt}&t=${t}&r=${r}&b=${b}&q=${q}`;
  const sign = md5(str);
  const ds = t + "," + r + "," + sign;
  //   log(str, sign);
  //   log(ds);
  return ds;
}

async function fetchAPI(uid, cookie, endpoint, query, body) {
  const url = new URL(API_URL + endpoint);
  url.search = new URLSearchParams(query).toString();
  const headers = {
    "x-rpc-client_type": "5",
    "x-rpc-app_version": "2.20.1",
    "Accept-Language": "zh-CN,zh-Hans;q=0.9",
    Accept: "application/json, text/plain, */*",
    Origin: "https://webstatic.mihoyo.com",
    Referer: "https://webstatic.mihoyo.com/",
    "User-Agent":
      "Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) miHoYoBBS/2.20.1",
    DS: generateDS(query, body),
    Cookie: cookie,
  };
  //   log(url);
  //   log(headers);
  const res = await fetch(url, {
    method: body ? "post" : "get",
    headers: headers,
  });
  return await res.json();
}

async function getDailyNote(uid, cookie) {
  const query = {
    role_id: uid,
    server: "cn_gf01",
  };
  return await fetchAPI(uid, cookie, "dailyNote", query);
}

async function main() {
  const data = await getDailyNote(
    process.env.MIHOYO_UID,
    process.env.MIHOYO_COOKIE
  );
  console.log(data);
}
if (require.main === module) {
  main();
}

module.exports = { getDailyNote };
