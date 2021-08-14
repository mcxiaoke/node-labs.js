const dayjs = require("dayjs");
const _ = require("lodash");
const fetch = require("node-fetch");
const toad = require("toad-scheduler");
const { md5: hex_md5 } = require("pure-md5");
const helper = require("../lib/helper");
const config = require("dotenv").config();
const DEBUG = process.env.DEBUG;
if (DEBUG) {
  console.log(config);
}

const BASE_URL = process.env.APP_BASE_URL || "http://192.168.4.1";

const BOOT_TIME = Date.now();
let gTaskCount = 0;

function log(...args) {
  console.log(...[dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"), ...args]);
}

function loge(...args) {
  console.error(...[dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"), ...args]);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

var gQop,
  gCount = 1,
  gRealm,
  gNonce,
  gUsername = "admin",
  gPasswd = "admin";

function clearAuthheader() {
  log("clear auth info");
  gQop = "";
  gCount = "";
  gRealm = "";
}

function parseSmsTime(recvTime) {
  var date = [];
  date = recvTime.split(",");
  var len = date.length;
  for (var j = 0; j < len - 1; j++) {
    //the last one is timezone , no need to handle
    if (parseInt(date[j]) < 10 && date[j].length < 2) {
      // add 0 if number is smaller than 10
      date[j] = "0" + date[j];
    }
  }
  date[0] = "20" + date[0];
  const isoStr = `${date[0]}-${date[1]}-${date[2]}T${date[3]}:${date[4]}:${
    date[5]
  }.000+0${parseInt(date[6])}:00`;
  const jsDate = new Date(isoStr);
  // log(date);
  // log(isoStr);
  // log(jsDate.toString());
  return jsDate;
}

function getSmsTime() {
  var date = new Date();
  var fullYear = new String(date.getFullYear());
  var year = fullYear.substr(2, fullYear.length - 1);
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var mimute = date.getMinutes();
  var second = date.getSeconds();
  var timeZone = 0 - date.getTimezoneOffset() / 60;
  var timeZoneStr = "";
  if (timeZone > 0) {
    timeZoneStr = "%2B" + timeZone;
  } else {
    timeZoneStr = "-" + timeZone;
  }
  var smsTime =
    year +
    "," +
    month +
    "," +
    day +
    "," +
    hour +
    "," +
    mimute +
    "," +
    second +
    "," +
    timeZoneStr;
  return smsTime;
}

function getValue(authstr) {
  const arr = authstr.split("=");
  return arr[1].substring(1, arr[1].indexOf('"', 2));
}

function hex(d) {
  // alert("d" + d );
  var hD = "0123456789ABCDEF";
  var h = hD.substr(d & 15, 1);
  while (d > 15) {
    d >>= 4;
    h = hD.substr(d & 15, 1) + h;
  }
  return h;
  //alert("h" + h);
  //    return parseInt(str.toString(), 16);
}
/**
 *
 * @param {*} requestType GET or POST
 * @returns authrization header with signature
 */
function getAuthHeader(requestType) {
  // return getCookie("Authheader");
  const hasAuth = gUsername && gPasswd && gRealm && gNonce && gQop;
  if (!hasAuth) {
    // log("getAuthHeader: no auth, skip");
    return "";
  }
  let rand, date, salt;
  let tmp, DigestRes, AuthCnonce_f;
  let HA1, HA2;

  HA1 = hex_md5(gUsername + ":" + gRealm + ":" + gPasswd);
  HA2 = hex_md5(requestType + ":" + "/cgi/xml_action.cgi");

  rand = Math.floor(Math.random() * 100001);
  date = new Date().getTime();

  salt = rand + "" + date;
  tmp = hex_md5(salt);
  AuthCnonce_f = tmp.substring(0, 16);
  //AuthCnonce_f = tmp;

  let strhex = hex(gCount++);
  let temp = "0000000000" + strhex;
  let Authcount = temp.substring(temp.length - 8);
  DigestRes = hex_md5(
    HA1 +
      ":" +
      gNonce +
      ":" +
      Authcount +
      ":" +
      AuthCnonce_f +
      ":" +
      gQop +
      ":" +
      HA2
  );

  return (
    "Digest " +
    'username="' +
    gUsername +
    '", realm="' +
    gRealm +
    '", nonce="' +
    gNonce +
    '", uri="' +
    "/cgi/xml_action.cgi" +
    '", response="' +
    DigestRes +
    '", qop=' +
    gQop +
    ", nc=" +
    Authcount +
    ', cnonce="' +
    AuthCnonce_f +
    '"'
  );
}

/**
 *
 * @param {*} params parse WWW-Authenticate
 */
async function parseAuthParams(params) {
  try {
    if (!params) {
      const res = await fetch(BASE_URL + "/login.cgi");
      params = res.headers.get("WWW-Authenticate");
    }
    log("parseAuthParams:", params);
    // 'Digest realm="Highwmg", nonce="790693", qop="auth"'
    const arr = params.split(" ");
    //nonce="718337c309eacc5dc1d2558936225417", qop="auth"
    gRealm = getValue(arr[1]);
    gNonce = getValue(arr[2]);
    gQop = getValue(arr[3]);
  } catch (error) {
    loge("parseAuthParams: error", error);
  }
}

/**
 *
 * @returns build login URL
 */
async function getLoginUrl() {
  let rand, date, salt;
  let tmp, DigestRes;
  let HA1, HA2;

  HA1 = hex_md5(gUsername + ":" + gRealm + ":" + gPasswd);
  HA2 = hex_md5("GET" + ":" + "/cgi/protected.cgi");

  rand = Math.floor(Math.random() * 100001);
  date = new Date().getTime();

  salt = rand + "" + date;
  tmp = hex_md5(salt);
  AuthCnonce = tmp.substring(0, 16);

  DigestRes = hex_md5(
    HA1 +
      ":" +
      gNonce +
      ":" +
      "00000001" +
      ":" +
      AuthCnonce +
      ":" +
      gQop +
      ":" +
      HA2
  );

  return (
    BASE_URL +
    "/login.cgi?Action=Digest&username=" +
    gUsername +
    "&realm=" +
    gRealm +
    "&nonce=" +
    gNonce +
    "&response=" +
    DigestRes +
    "&qop=" +
    gQop +
    "&cnonce=" +
    AuthCnonce +
    "&temp=marvell"
  );
}

/**
 *
 * @param {*} fetchParams fetch WWW-Authenticate again
 * @returns login successful
 */
async function doLogin(fetchParams = true) {
  try {
    fetchParams && (await parseAuthParams());
    const url = await getLoginUrl();
    log("do login url:", url, fetchParams);
    const authHeader = getAuthHeader("GET");
    // log("do login auth:", authHeader);
    const res = await fetch(url, {
      method: "get",
      headers: {
        Authorization: authHeader,
      },
    });
    const body = await res.text();
    const ret = body && body.includes("200 OK");
    log("do login success:", ret, res.status);
    return ret;
  } catch (error) {
    loge("do login failed:", error);
  }
  return false;
}

/**
 * send api request
 * @param {*} jsonName API path name
 * @param {*} body POST body object
 * @returns HTTP response object
 */
async function doRequest(jsonName, body = undefined) {
  method = body ? "post" : "get";
  const url =
    BASE_URL +
    `/xml_action.cgi?method=${method}&module=duster&file=json_${jsonName}${new Date().getTime()}`;

  if (DEBUG) {
    log("request api:", method, jsonName, body || "");
  }
  const authHeader = getAuthHeader(method.toUpperCase());
  // log("request auth:", authHeader);
  const res = await fetch(url, {
    method: method.toUpperCase(),
    body: body && typeof body == "object" && JSON.stringify(body),
    headers: {
      Authorization: authHeader,
    },
    timeout: 2000,
  });
  // log("request res:", res.status, res.headers.get("WWW-Authenticate") || "OK");
  return res;
}

/**
 *
 * send api request with login check and retry
 * @param {*} jsonName API path name
 * @param {*} body POST body object
 * @returns HTTP response data
 */
async function sendRequest(jsonName, body = undefined) {
  const hasAuth = gNonce && gNonce.length > 2 && gRealm && gRealm.length > 2;
  try {
    // if (!hasAuth) {
    if (!hasAuth && jsonName !== "status") {
      loge("send request no auth, need login");
      const loginSuccess = await doLogin(true);
      if (!loginSuccess) {
        throw Error("login failed!");
      }
    } else {
      // log("send request auth info found");
    }
    let res = await doRequest(jsonName, body);
    if (res.headers.has("WWW-Authenticate")) {
      loge("send request need login, retry");
      clearAuthheader();
      await parseAuthParams(res.headers.get("WWW-Authenticate"));
      const loginSuccess = await doLogin(false);
      if (loginSuccess) {
        res = await doRequest(jsonName, body);
      } else {
        throw Error("login failed");
      }
    }
    const data = await res.text();
    // log("send request data:", data);
    if (data && data.length > 0) {
      const json = JSON.parse(data);
      if (json) {
        return helper.convertValue(json);
      }
    }
  } catch (error) {
    loge("send request ", String(error), jsonName);
  }
}

/**
 * delete sms
 * @param {*} ids message ids
 * @returns delete result
 */
async function smsDelete(ids) {
  if (!ids || ids.length == 0) {
    return;
  }
  if (typeof ids === "string") {
    ids = [ids];
  }
  ids = ids.join(",") + ",";
  ids = ids.replace(/,{2,}/g, ",");
  let body = {
    message_flag: "DELETE_SMS",
    sms_cmd: 6,
    tags: 12,
    mem_store: 1,
    delete_message_id: ids,
  };
  const result = await sendRequest("message", body);
  if (!result) {
    loge("smsDelete: failed to delete", ids);
  } else {
    // log(result);
    log("smsDelete: success to delete", ids);
  }
  return result;
}

/**
 * read sms
 * @param {*} msgId message id
 * @returns read result
 */
async function smsRead(msgId) {
  if (!msgId || msgId.length == 0) {
    return;
  }
  let body = {
    message_flag: "SET_MSG_READ",
    sms_cmd: 7,
    tags: 12,
    mem_store: 1,
    read_message_id: msgId,
  };
  const result = await sendRequest("message", body);
  if (!result) {
    loge("smsRead: failed to read", msgId);
  } else {
    // log(result);
    log("smsRead: success to read", msgId);
  }
  return result;
}

/**
 * send sms
 * @param {*} phoneNo phone number send to
 * @param {*} text sms text content
 * @returns send result
 */
async function smsSend(phoneNo, text) {
  if (!phoneNo || !text) {
    loge("smsSend: need phoneNo and text");
    return;
  }
  if (!/^\+?\d+$/.test(phoneNo)) {
    loge("smsSend: invalid phoneNo");
    return;
  }
  let encodeType = "UNICODE";
  if (helper.IsGSM7Code(text)) {
    encodeType = "GSM7_default";
  }
  let body = {
    send_from_draft_id: "",
    message_flag: "SEND_SMS",
    sms_cmd: 4,
    contacts: phoneNo + ",",
    content: helper.UniEncode(text),
    encode_type: encodeType,
    sms_time: getSmsTime(),
  };
  log("smsSend:", body);
  const result = await sendRequest("message", body);
  if (!result) {
    loge("smsSend: failed to send", phoneNo, text);
  } else {
    // log(result);
    log("smsSend: success to send", phoneNo, text);
  }
  return result;
}

/**
 * decode sms subject and from
 * @param {*} data sms json object
 * @returns decoded sms object
 */
function smsDecode(data) {
  const items = data["Item"];
  if (!items || items.length == 0) {
    return data;
  }
  for (const item of items) {
    item["from"] = helper.UniDecode(item["from"]);
    item["sender"] = item["from"].split(";")[1];
    item["received"] = parseSmsTime(item["received"]);
    item["subject"] = helper.UniDecode(item["subject"]);
  }
  return data;
}

/**
 * fetch sms inbox messages
 * @param {*} pageNo page index
 * @param {*} perPage count per index
 * @returns decoded sms inbox
 */
async function smsGetInbox(pageNo = 1, perPage = 10) {
  // sms inbox
  let body = {
    message_flag: "GET_RCV_SMS_LOCAL",
    page_number: pageNo,
    data_per_page: perPage,
  };
  // log("smsGetInbox", body);
  const result = await sendRequest("message", body);
  return smsDecode(result);
}

/**
 * filter unread sms messages
 * @param {*} data inbox object
 * @returns filtered messages
 */
async function smsFilter(data) {
  let items = data["Item"];
  if (!items || items.length == 0) {
    return [];
  }
  const allowed = ["index", "subject", "sender", "received"];
  items = items.filter((it) => it.subject && it.status === 0);
  // sort by message_time_index
  items = items.sort(
    (a, b) => a["message_time_index"] - b["message_time_index"]
  );
  return items.map((it) => _.pick(it, allowed));
}

/**
 * sms inbox check all
 * @returns nothing
 */
async function smsCheck() {
  ++gTaskCount;
  if (DEBUG) {
    console.log("------------------------------", gTaskCount);
  }
  log(`smsCheck(${gTaskCount}) up time:`, helper.humanTime(BOOT_TIME));
  // GET_RCV_SMS_LOCAL 本地收件箱
  // GET_SENT_SMS_LOCAL 本地发件箱
  // GET_SIM_SMS SIM卡收件箱
  // GET_DRAFT_SMS 草稿箱
  // 4 - SEND_SMS
  // 5 - SAVE_SMS
  // 6 - DELETE_SMS
  // 7 - SET_MSG_READ
  //todo 收件箱快满了时自动删除最旧的10条
  // 运行流程：
  // 获取状态，看是否有未读消息
  // 获取收件箱短消息列表
  // 如果有未读信息，转发出去
  // 将未读信息标记为已读
  // 如果登录失败或者发生错误放弃
  // 多次错误发送警告消息
  // 下次循环继续
  // step1, check status, login not needed
  // const device = await sendRequest("altair_state");
  // if (!typeof device == "object") {
  //   log("checkSms: failed to get device status.");
  //   return;
  // }
  // log(device);
  let status = await sendRequest("status");
  if (!(typeof status == "object")) {
    loge("smsCheck: failed to get sms status.");
    return;
  }
  // log(status);
  if (
    status["sim_status"] !== 0 ||
    status["sys_mode"] === 0 ||
    status["operator_name"].length === 0 ||
    status["MSISDN"].length === 0
  ) {
    loge("smsCheck: no sim or no service");
    return;
  }
  let unreadNum = status["sms_unread_long_num"] || 0;
  if (unreadNum == 0) {
    log("smsCheck: no unread messages.", gTaskCount);
    return;
  }
  log("smsCheck: sms unread count:", status["sms_unread_long_num"]);
  status = await sendRequest("message");
  if (!(typeof status == "object")) {
    loge("smsCheck: failed to get inbox status.");
    return;
  }
  if (status["sms_nv_rev_num"] + 20 > status["sms_nv_rev_total"]) {
    // todo clear old sms items
    const total = status["sms_nv_rev_total"];
    const num = status["sms_nv_rev_num"];
    loge("smsCheck: no enough space:", num, total);
    const toDeleteIDs = Array(Math.floor(num / 2))
      .fill()
      .map((v, i) => `LRCV${i + 1}`);
    log(toDeleteIDs);
    await smsDelete(toDeleteIDs);
  }
  unreadNum =
    status["sms_nv_unread_long"] ||
    status["sms_unread_long_num"] ||
    status["new_sms_num"] ||
    0;
  if (unreadNum == 0) {
    log("smsCheck: inbox no unread messages.");
    return;
  }
  log(`smsCheck: found ${unreadNum} unread messages.`);
  const fetchNum = Math.max(5, unreadNum + 1);
  let inbox = await smsGetInbox(1, fetchNum);
  if (!inbox) {
    loge("smsCheck: failed to get inbox.");
    return;
  }
  // log(inbox);
  let newMsgs = await smsFilter(inbox);
  if (!newMsgs || newMsgs.length == 0) {
    log("smsCheck: no unread messages.");
    return;
  }
  // log(newMsgs);
  // forward and read sms
  for (const msg of newMsgs) {
    log("smsCheck: processing", msg.index, msg.sender, msg.subject);
    const title = `来自 ${msg.sender} 的短信`;
    const dt = dayjs(msg.received).format("YYYY-MM-DD HH:mm:ss Z");
    const desp = `\n${msg.subject} (${dt})`;
    await helper.sendTG(title, desp);
    const sent = await helper.sendWX(title, desp);
    if (sent) {
      const msgId = msg.index;
      if (msgId.includes(",")) {
        const ids = msgId.split(",");
        for (const id of ids) {
          id && (await smsRead(id));
        }
      } else {
        await smsRead(msgId);
      }
    }
    await sleep(1000);
  }
}

/**
 * sms check task running forever
 */
async function main(intervalSecs = 5) {
  const scheduler = new toad.ToadScheduler();
  const task = new toad.AsyncTask("smsCheck", smsCheck, (err) => {
    loge("smsCheck:", err);
  });
  const job = new toad.SimpleIntervalJob({ seconds: intervalSecs }, task);
  scheduler.addSimpleIntervalJob(job);
  log("smsCheck scheduled task started!");
}

module.exports.main = main;