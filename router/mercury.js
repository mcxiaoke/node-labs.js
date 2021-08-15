const fetch = require("node-fetch");
const _ = require("lodash");
const { log, loge } = require("../lib/helper");
const config = require("dotenv").config();
const DEBUG = process.env.DEBUG;
if (DEBUG) {
  console.log(config);
}

const BASE_URL = "http://192.168.1.1";
const PASSWORD = process.env.APP_ROUTER_PASSWORD;
let gToken; // last mercury stok

function securityEncode(a, b, c) {
  var d = "",
    e,
    f,
    g,
    h,
    k = 187,
    l = 187;
  f = a.length;
  g = b.length;
  h = c.length;
  e = f > g ? f : g;
  for (var m = 0; m < e; m++)
    (l = k = 187),
      m >= f
        ? (l = b.charCodeAt(m))
        : m >= g
        ? (k = a.charCodeAt(m))
        : ((k = a.charCodeAt(m)), (l = b.charCodeAt(m))),
      (d += c.charAt((k ^ l) % h));
  return d;
}

// from http://192.168.1.1/web-static/dynaform/class.js
function orgAuthPwd(password) {
  return securityEncode(
    password,
    "RDpbLfCPsJZ7fiv",
    "yLwVl0zKqws7LgKPRQ84Mdt708T1qQ3Ha7xv3H7NyU84p21BriUWBU43odz3iP4rBL3cD02KZciXTysVXiV8ngg6vL48rPJyAUw0HurW20xqxv9aYb4M9wK1Ae0wlro510qXeU07kV57fQMc8L6aLgMLwygtc0F10a0Dg70TOoouyFhdysuRMO51yY5ZlOZZLEal1h0t9YQW0Ko7oBwmCAHoic4HYbUyVeU3sfQ1xtXcPcf1aT303wAQhv66qzW"
  );
}

async function login() {
  gToken = null;
  const body = {
    method: "do",
    login: {
      password: orgAuthPwd(PASSWORD),
    },
  };
  log("login req:", body);
  try {
    const res = await fetch(BASE_URL + "/", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const data = await res.json();
    log("login res:", res.status, JSON.stringify(data));
    if (res.ok && data["error_code"] === 0) {
      gToken = data["stok"];
      return gToken;
    }
  } catch (error) {
    loge("login err:", String(error));
  }
}

async function request(body, retry = false) {
  if (!body) {
    return { error: new Error("invalid body") };
  }
  if (!gToken) {
    await login();
  }
  if (!gToken) {
    return { error: new Error("need auth token") };
  }
  if (DEBUG) {
    log(
      `request body:${JSON.stringify(body)} token:${Boolean(
        gToken
      )} retry:${retry}`
    );
  }
  try {
    const res = await fetch(BASE_URL + "/stok=" + gToken + "/ds", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (res.status === 401 && !retry) {
      loge("request unauthorized, retry login");
      gToken = null;
      await login();
      await request(body, true);
    }
    const data = await res.json();
    // log("request res:", res.status);
    // log("request data:",data);
    return { data: data };
  } catch (error) {
    loge("request err:", String(error));
    return { error: error };
  }
}

async function rebootDevice() {
  const body = {
    method: "do",
    system: {
      reboot: null,
    },
  };
  const result = await request(body);
  return result.data;
}

async function getWANStatus() {
  const body = {
    method: "get",
    network: {
      name: "wan_status",
    },
  };
  const result = await request(body);
  if (result && result.data) {
    return result.data["network"]["wan_status"];
  }
}

async function getOnlineHosts(filterFn) {
  const body = {
    method: "get",
    hosts_info: {
      table: "host_info",
    },
  };
  const result = await request(body);
  if (result && result.data) {
    // wifi_mode 0: 2.4G, 1: 5G
    // type 0: Eth 1: WiFi
    // const allowedKeys = ["mac", "ip", "hostname", "wifi_mode", "type"];
    const allowedKeys = ["mac", "ip", "hostname"];
    let hosts = result.data["hosts_info"]["host_info"];
    hosts = hosts.map((it) => {
      return _.pick(Object.values(it)[0], allowedKeys);
    });
    hosts.forEach((it) => {
      it["hostname"] = decodeURIComponent(it["hostname"]);
      it["date"] = Date.now();
    });
    return hosts.filter(filterFn || Boolean);
  }
}

module.exports = { login, rebootDevice, getWANStatus, getOnlineHosts };
