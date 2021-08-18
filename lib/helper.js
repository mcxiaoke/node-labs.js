const dayjs = require("dayjs");
const fetch = require("node-fetch");
const HttpsProxyAgent = require("https-proxy-agent");
const { URLSearchParams, URL } = require("url");

function humanTime(startMs) {
  // TIP: to find current time in milliseconds, use:
  // var  current_time_milliseconds = new Date().getTime();
  function numberEnding(number) {
    return number > 1 ? "s" : "";
  }
  let timeStr = "";
  let milliseconds = Date.now() - startMs;
  let temp = Math.floor(milliseconds / 1000);
  let years = Math.floor(temp / 31536000);
  if (years) {
    timeStr += " " + years + " year" + numberEnding(years);
  }
  //TODO: Months! Maybe weeks?
  let days = Math.floor((temp %= 31536000) / 86400);
  if (days) {
    timeStr += " " + days + " day" + numberEnding(days);
  }
  let hours = Math.floor((temp %= 86400) / 3600);
  if (hours) {
    timeStr += " " + hours + " hour" + numberEnding(hours);
  }
  let minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) {
    timeStr += " " + minutes + " minute" + numberEnding(minutes);
  }
  let seconds = temp % 60;
  timeStr += " " + seconds + " second" + numberEnding(seconds);
  return timeStr;
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

function onlyDigits(str) {
  return /^\d+$/.test(str);
}

function convertValue(data) {
  if (!typeof data === "object") {
    return;
  }
  for (const [k, v] of Object.entries(data)) {
    // caution: do not replace this entry value to number
    if (v.length > 6 || k === "subject" || k === "from" || k === "received") {
      continue;
    }
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

function log(...args) {
  console.log(dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"), ...args);
}

function loge(...args) {
  console.error(dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"), ...args);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  convertValue,
  UniDecode,
  UniEncode,
  IsGSM7Code,
  humanTime,
  log,
  loge,
  sleep,
};
