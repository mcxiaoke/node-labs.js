const fetch = require("node-fetch");
const HttpsProxyAgent = require("https-proxy-agent");
const { URLSearchParams, URL } = require("url");
const net = require("net");
const { log, loge } = require("./helper");

DEBUG = process.env.DEBUG;

async function isPortOpen(host, port, timeout = 1000) {
  const promise = new Promise((resolve, reject) => {
    const socket = new net.Socket();

    const onError = () => {
      socket.destroy();
      reject();
    };

    socket.setTimeout(timeout);
    socket.once("error", onError);
    socket.once("timeout", onError);

    socket.connect(port, host, () => {
      socket.end();
      resolve();
    });
  });

  try {
    await promise;
    return true;
  } catch (_) {
    return false;
  }
}

async function sendWX(title, desp) {
  const url = new URL(process.env.APP_WX_REPORT_URL);
  const params = new URLSearchParams({ title: title, desp: desp });
  url.search = params.toString();

  DEBUG && log("sendWX", title, desp);
  try {
    const res = await fetch(url);
    log("sendWX res:", res.status, title);
    if (!res.ok) {
      loge("sendWX failed:", await res.text());
    }
    return res.ok;
  } catch (error) {
    loge("sendWX error:", String(error));
    return false;
  }
}

async function sendTG(title, desp) {
  const proxy =
    process.env.APP_HTTP_PROXY ||
    process.env.http_proxy ||
    "http://127.0.0.1:2081";
  DEBUG && console.log("sendTG proxy:", proxy);
  const agent = new HttpsProxyAgent(proxy);
  const url = new URL(process.env.APP_TG_REPORT_URL);
  const params = new URLSearchParams({ text: `${title}\n${desp}` });
  DEBUG && console.log("sendTG", title, desp);
  try {
    const res = await fetch(url, {
      method: "POST",
      body: params,
      agent: agent,
    });
    // const text = await res.json();
    log("sendTG res:", res.status, title);
    if (!res.ok) {
      loge("sendTG failed:", await res.text());
    }
    return res.ok;
  } catch (error) {
    loge("sendTG error:", String(error));
    return false;
  }
}

module.exports = { sendTG, sendWX, isPortOpen };
