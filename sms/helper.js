const fetch = require("node-fetch");
const HttpsProxyAgent = require("https-proxy-agent");
const { URLSearchParams, URL } = require("url");

function humanTime(startMs) {
  // TIP: to find current time in milliseconds, use:
  // var  current_time_milliseconds = new Date().getTime();
  function numberEnding(number) {
    return number > 1 ? "s" : "";
  }
  var milliseconds = Date.now() - startMs;
  var temp = Math.floor(milliseconds / 1000);
  var years = Math.floor(temp / 31536000);
  if (years) {
    return years + " year" + numberEnding(years);
  }
  //TODO: Months! Maybe weeks?
  var days = Math.floor((temp %= 31536000) / 86400);
  if (days) {
    return days + " day" + numberEnding(days);
  }
  var hours = Math.floor((temp %= 86400) / 3600);
  if (hours) {
    return hours + " hour" + numberEnding(hours);
  }
  var minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) {
    return minutes + " minute" + numberEnding(minutes);
  }
  var seconds = temp % 60;
  if (seconds) {
    return seconds + " second" + numberEnding(seconds);
  }
  return milliseconds + " ms";
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

function IsGSM7Code(str) {
  var len = 0;
  for (var i = 0; i < str.length; i++) {
    var chr = str.charCodeAt(i);
    if (
      ((chr >= 0x20 && chr <= 0x7f) ||
        0x20ac == chr ||
        0x20ac == chr ||
        0x0c == chr ||
        0x0a == chr ||
        0x0d == chr ||
        0xa1 == chr ||
        0xa3 == chr ||
        0xa5 == chr ||
        0xa7 == chr ||
        0xbf == chr ||
        0xc4 == chr ||
        0xc5 == chr ||
        0xc6 == chr ||
        0xc7 == chr ||
        0xc9 == chr ||
        0xd1 == chr ||
        0xd6 == chr ||
        0xd8 == chr ||
        0xdc == chr ||
        0xdf == chr ||
        0xe0 == chr ||
        0xe4 == chr ||
        0xe5 == chr ||
        0xe6 == chr ||
        0xe8 == chr ||
        0xe9 == chr ||
        0xec == chr ||
        0xf11 == chr ||
        0xf2 == chr ||
        0xf6 == chr ||
        0xf8 == chr ||
        0xf9 == chr ||
        0xfc == chr ||
        0x3c6 == chr ||
        0x3a9 == chr ||
        0x3a8 == chr ||
        0x3a3 == chr ||
        0x3a0 == chr ||
        0x39e == chr ||
        0x39b == chr ||
        0x398 == chr ||
        0x394 == chr ||
        0x393 == chr) &&
      0x60 != chr
    ) {
      ++len;
    }
  }
  return len == str.length;
}

async function sendWX(title, desp) {
  const url = new URL(process.env.APP_WX_REPORT_URL);
  const params = new URLSearchParams({ title: title, desp: desp });
  url.search = params.toString();

  console.log("sendWX", title, desp);
  try {
    const res = await fetch(url);
    const text = await res.json();
    console.log("sendWX res:", res.status, title);
    return true;
  } catch (error) {
    console.log("sendWX error:", error);
    return false;
  }
}

async function sendTG(title, desp) {
  const proxy =
    process.env.APP_HTTP_PROXY ||
    process.env.http_proxy ||
    "http://127.0.0.1:2081";
  const agent = new HttpsProxyAgent(proxy);
  const url = new URL(process.env.APP_TG_REPORT_URL);
  const params = new URLSearchParams({ text: `${title}\n${desp}` });
  console.log("sendTG", title, desp);
  try {
    const res = await fetch(url, {
      method: "POST",
      body: params,
      agent: agent,
    });
    const text = await res.json();
    console.log("sendTG res:", res.status, title);
    return true;
  } catch (error) {
    console.log("sendTG error:", error);
    return false;
  }
}

module.exports.UniDecode = UniDecode;
module.exports.UniEncode = UniEncode;
module.exports.IsGSM7Code = IsGSM7Code;
module.exports.sendTG = sendTG;
module.exports.sendWX = sendWX;
module.exports.humanTime = humanTime;
