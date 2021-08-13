const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const { hex_md5 } = require("./md5");
const config = require("./private.json");

// const configPath = path.resolve("./lib/private.json");
// const config = JSON.parse(fs.readFileSync(configPath));
log(config);

function log() {
  console.log.apply(console, arguments);
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

function onlyDigits(str) {
  return /^\d+$/.test(str);
}

function UniDecode(encodeString) {
  if (undefined == encodeString) {
    return "";
  }
  var deCodeStr = "";

  var strLen = encodeString.length / 4;
  for (var idx = 0; idx < strLen; ++idx) {
    deCodeStr += String.fromCharCode(
      parseInt(encodeString.substr(idx * 4, 4), 16)
    );
  }
  return deCodeStr;
}
function UniEncode(string) {
  if (undefined == string) {
    return "";
  }
  var code = "";
  for (var i = 0; i < string.length; ++i) {
    var charCode = string.charCodeAt(i).toString(16);
    var paddingLen = 4 - charCode.length;
    for (var j = 0; j < paddingLen; ++j) {
      charCode = "0" + charCode;
    }

    code += charCode;
  }
  return code;
}

function convertValue(data) {
  if (!typeof data === "object") {
    return;
  }
  for (const [k, v] of Object.entries(data)) {
    //  && !Number.isNaN(parseInt(v))
    if (typeof v === "string" && onlyDigits(v)) {
      data[k] = parseInt(v);
    } else if (typeof v === "object") {
      convertValue(v);
    } else if (Array.isArray(v)) {
      for (const item of v) {
        convertValue(item);
      }
    }
  }
  return data;
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

function GetSmsTime() {
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
function getAuthHeader(requestType) {
  // return getCookie("Authheader");
  const hasAuth = gUsername && gPasswd && gRealm && gNonce && gQop;
  if (!hasAuth) {
    log("getAuthHeader: no auth, skip");
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

async function parseAuthParams(params) {
  try {
    if (!params) {
      const res = await fetch(config.BASE_URL + "/login.cgi");
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
    console.error("parseAuthParams: error", error);
  }
}

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
    config.BASE_URL +
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
    log("do login failed:", error);
  }
  return false;
}

async function doRequest(jsonName, body = undefined) {
  method = body ? "post" : "get";
  const url =
    config.BASE_URL +
    `/xml_action.cgi?method=${method}&module=duster&file=json_${jsonName}${new Date().getTime()}`;

  log("request url:", url);
  const authHeader = getAuthHeader(method.toUpperCase());
  // log("request auth:", authHeader);
  const res = await fetch(url, {
    method: method.toUpperCase(),
    body: body && typeof body == "object" && JSON.stringify(body),
    headers: {
      Authorization: authHeader,
    },
  });
  log("request res:", res.status, res.headers.get("WWW-Authenticate") || "");
  return res;
}

async function sendRequest(jsonName, body = undefined) {
  const hasAuth = gNonce && gNonce.length > 2 && gRealm && gRealm.length > 2;
  if (!hasAuth && jsonName !== "status") {
    log("send request no auth, need login");
    const loginSuccess = await doLogin(true);
    if (!loginSuccess) {
      throw Error("Login Failed, Abort!");
    }
  } else {
    log("send request auth info found");
  }
  try {
    let res = await doRequest(jsonName, body);
    if (res.headers.get("WWW-Authenticate")) {
      log("send request need login, retry");
      clearAuthheader();
      await parseAuthParams(res.headers.get("WWW-Authenticate"));
      const loginSuccess = await doLogin(false);
      if (loginSuccess) {
        res = await doRequest(jsonName, body);
      } else {
        throw Error("Login Failed, Abort!");
      }
    }
    const data = await res.text();
    // log("send request data:", data);
    if (data && data.length > 0) {
      const json = JSON.parse(data);
      if (json) {
        return convertValue(json);
      }
    }
  } catch (error) {
    log("send request error:", String(error), jsonName);
  }
}

async function getDeviceStatus() {
  await sendRequest("altair_state");
}

async function smsDelete(ids) {
  if (!ids || ids.length == 0) {
    return;
  }
  ids = ids.join(",") + ",";
  ids = ids.replace(/,{2,}/g, ",");
  let body = {
    message_flag: "DELETE_SMS",
    sms_cmd: 6,
    tags: "",
    data_per_page: perPage,
    delete_message_id: ids,
  };
  const result = await sendRequest("message", body);
  if (!result) {
    log("smsDelete: failed to delete sms.");
  } else {
    log(result);
    log("smsDelete: success to delete sms.");
  }
}

function smsDecode(data) {
  const items = data["Item"];
  if (!items || items.length == 0) {
    return data;
  }
  for (const item of items) {
    item["from"] = UniDecode(item["from"]);
    item["sender"] = item["from"].split(";")[1];
    item["subject"] = UniDecode(item["subject"]);
    item["received"] = parseSmsTime(item["received"]);
  }
  return data;
}

async function smsGetInbox(pageNo = 1, perPage = 10) {
  // sms inbox
  let body = {
    message_flag: "GET_RCV_SMS_LOCAL",
    page_number: pageNo,
    data_per_page: perPage,
  };
  log("smsGetInbox", body);
  const result = await sendRequest("message", body);
  return smsDecode(result);
}

async function smsGetUnread(data) {
  const items = data["Item"];
  if (!items || items.length == 0) {
    return [];
  }
  return items;
}

async function smsCheck() {
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
  const status = await sendRequest("message");
  if (!(typeof status == "object")) {
    log("smsCheck: failed to get sms status.");
    return;
  }
  log(status);
  if (status["sms_nv_rev_num"] + 20 > status["sms_nv_rev_total"]) {
    // todo clear old sms items
    const total = status["sms_nv_rev_total"];
    const num = status["sms_nv_rev_num"];
    log("smsCheck: no enough space:", num, total);
    const toDeleteIDs = Array(Math.floor(num / 2))
      .fill()
      .map((v, i) => `LRCV${i + 1}`);
    log(toDeleteIDs);
  }
  const unreadNum =
    status["sms_nv_unread_long"] ||
    status["sms_unread_long_num"] ||
    status["new_sms_num"] ||
    0;
  if (unreadNum == 0) {
    log("smsCheck: no unread messages.");
    return;
  }
  log("smsCheck: found unread messages.");
  const fetchNum = Math.max(10, unreadNum + 1);
  let inbox = await smsGetInbox(1, fetchNum);
  if (!inbox) {
    log("smsCheck: failed to get inbox.");
    return;
  }
  // log(inbox);
}

async function sendWXMessage(title, desp) {
  log("sendWXMessage params:", title, desp);
  try {
    const res = await fetch(config.WX_REPORT_URL, {
      method: "GET",
      body: { title: title, desp: desp },
    });
    const text = await res.text();
    log("sendWXMessage res:", res.status, text);
    return true;
  } catch (error) {
    log("sendWXMessage error:", error);
    return false;
  }
}

async function sendTGMessage(title, desp) {
  log("sendTGMessage params:", title, desp);
  try {
    const res = await fetch(config.TG_REPORT_URL, {
      method: "GET",
      body: { title: title, desp: desp },
    });
    const text = await res.text();
    log("sendTGMessage res:", res.status, text);
    return true;
  } catch (error) {
    log("sendTGMessage error:", error);
    return false;
  }
}

async function main() {
  smsCheck();
  // await getDeviceStatus();
  // device status, no need login
  // await sendRequest("status");
  // sms status
  // await sendRequest("message");
  // sms inbox
  // let body = {
  //   message_flag: "GET_RCV_SMS_LOCAL",
  //   page_number: 1,
  //   data_per_page: 10,
  // };
  // const result = await sendRequest("message", JSON.stringify(body));
  // parseSms(result);
  // parseSmsTime(result["Item"][0]["received"]);
  // send sms
  // let body = {
  //   send_from_draft_id: "",
  //   message_flag: "SEND_SMS",
  //   sms_cmd: 4,
  //   encode_type: "UNICODE",
  //   contacts: "+8618513583128,",
  //   sms_time: GetSmsTime(),
  //   content: UniEncode("来自VSCode Node的测试短信哈哈啊哈哈！！！"),
  // };
  // await sendRequest("message", JSON.stringify(body));
  // GET_RCV_SMS_LOCAL 本地收件箱
  // GET_SENT_SMS_LOCAL 本地发件箱
  // GET_SIM_SMS SIM卡收件箱
  // GET_DRAFT_SMS 草稿箱
  // 4 - SEND_SMS
  // 5 - SAVE_SMS
  // 6 - DELETE_SMS
  // 7 - SET_MSG_READ
}

module.exports.main = main;
