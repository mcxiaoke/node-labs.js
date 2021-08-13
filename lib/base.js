const fetch = require("node-fetch");
const { URLSearchParams } = require("url");
const { hex_md5 } = require("./md5");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36";
const BASE_URL = "http://192.168.4.1";

var AuthQop,
  username = "",
  passwd = "",
  GnCount = 1,
  Authrealm,
  Gnonce,
  nonce;
var Authheader;

function clearAuthheader() {
  //clearing coockies
  Authheader = "";
  AuthQop = "";
  username = "";
  passwd = "";
  GnCount = "";
  Authrealm = "";
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

function login_done(urlData) {
  if (urlData.indexOf("200 OK") != -1) {
    return true;
  } else {
    return false;
  }
}
function getValue(authstr) {
  var arr = authstr.split("=");
  return arr[1].substring(1, arr[1].indexOf('"', 2));
}

async function getAuthParams(url) {
  try {
    const res = await fetch(url);
    return res.headers.get("WWW-Authenticate");
  } catch (error) {
    console.error("getAuthParams", error);
  }
}

async function getLoginUrl(username1, passwd1) {
  var url = BASE_URL + "/login.cgi";
  var loginParam = await getAuthParams(url);
  console.log("get login url, param:", loginParam);
  //alert(loginParam);
  // 'Digest realm="Highwmg", nonce="790693", qop="auth"'
  var loginParamArray = loginParam.split(" ");
  //nonce="718337c309eacc5dc1d2558936225417", qop="auth"
  Authrealm = getValue(loginParamArray[1]);
  nonce = getValue(loginParamArray[2]);
  AuthQop = getValue(loginParamArray[3]);

  console.log(
    "Authrealm :" + Authrealm,
    "nonce :" + nonce,
    "AuthQop :" + AuthQop
  );

  username = username1;
  passwd = passwd1;
  var rand, date, salt;

  Gnonce = nonce;
  var tmp, DigestRes;
  var HA1, HA2;

  HA1 = hex_md5(username + ":" + Authrealm + ":" + passwd);
  HA2 = hex_md5("GET" + ":" + "/cgi/protected.cgi");

  rand = Math.floor(Math.random() * 100001);
  date = new Date().getTime();

  salt = rand + "" + date;
  tmp = hex_md5(salt);
  AuthCnonce = tmp.substring(0, 16);

  DigestRes = hex_md5(
    HA1 +
      ":" +
      nonce +
      ":" +
      "00000001" +
      ":" +
      AuthCnonce +
      ":" +
      AuthQop +
      ":" +
      HA2
  );

  url =
    BASE_URL +
    "/login.cgi?Action=Digest&username=" +
    username +
    "&realm=" +
    Authrealm +
    "&nonce=" +
    nonce +
    "&response=" +
    DigestRes +
    "&qop=" +
    AuthQop +
    "&cnonce=" +
    AuthCnonce +
    "&temp=marvell";
  return url;
}

async function doLogin(username1, passwd1) {
  const url = await getLoginUrl(username1, passwd1);
  console.log("do login ,url:", url);
  const res = await authentication(url);
  console.log("do login ,res:", res);
  const ret = login_done(res);
  console.log("do login ,done:", ret);
}

async function authentication(url) {
  const authHeader = getAuthHeader("GET");
  console.log("authentication authHeader:", authHeader);
  const content = await fetch(url, {
    method: "get",
    headers: {
      Accept: "text/html",
      Authorization: authHeader,
      "User-Agent": UA,
      Expires: "-1",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
  console.log("authentication headers", content.status, content.headers.raw());
  return content.text();
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
function getAuthHeader(requestType, file) {
  // return getCookie("Authheader");
  let rand, date, salt, strAuthHeader;
  let tmp, DigestRes, AuthCnonce_f;
  let HA1, HA2;

  HA1 = hex_md5(username + ":" + Authrealm + ":" + passwd);
  HA2 = hex_md5(requestType + ":" + "/cgi/xml_action.cgi");

  rand = Math.floor(Math.random() * 100001);
  date = new Date().getTime();

  salt = rand + "" + date;
  tmp = hex_md5(salt);
  AuthCnonce_f = tmp.substring(0, 16);
  //AuthCnonce_f = tmp;

  let strhex = hex(GnCount);
  let temp = "0000000000" + strhex;
  let Authcount = temp.substring(temp.length - 8);
  DigestRes = hex_md5(
    HA1 +
      ":" +
      nonce +
      ":" +
      Authcount +
      ":" +
      AuthCnonce_f +
      ":" +
      AuthQop +
      ":" +
      HA2
  );

  GnCount++;
  strAuthHeader =
    "Digest " +
    'username="' +
    username +
    '", realm="' +
    Authrealm +
    '", nonce="' +
    nonce +
    '", uri="' +
    "/cgi/xml_action.cgi" +
    '", response="' +
    DigestRes +
    '", qop=' +
    AuthQop +
    ", nc=" +
    Authcount +
    ', cnonce="' +
    AuthCnonce_f +
    '"';
  DigestHeader = strAuthHeader;
  return strAuthHeader;
}

async function sendRequest(jsonName, method = "get", body = undefined) {
  jsonName = "json_" + jsonName;
  var ctx;
  var url =
    BASE_URL +
    `/xml_action.cgi?method=${method}&module=duster&file=${jsonName}${Date.parse(
      new Date()
    )}`;

  console.log("send request, url:", url);

  try {
    const result = await fetch(url, {
      method: method.toUpperCase(),
      body: body,
      headers: {
        Authorization: getAuthHeader("GET"),
        "User-Agent": UA,
      },
    });
    const text = await result.text();

    console.log("get json", result.status, text);

    // var firstNewSmsContent = text;
    // if (firstNewSmsContent) {
    //   var firstNewSmsString = firstNewSmsContent.substring(
    //     firstNewSmsContent.indexOf("{"),
    //     firstNewSmsContent.lastIndexOf("}") + 1
    //   );
    //   if (
    //     firstNewSmsString.indexOf("UNAUTHORIZED") > 0 ||
    //     firstNewSmsString.indexOf("KICKOFF") > 0
    //   ) {
    //     clearAuthheader();
    //   } else {
    //     ctx = JSON.parse(firstNewSmsString);
    //     if (callbackFun) {
    //       callbackFun(ctx);
    //     }
    //   }
    // }
  } catch (error) {
    console.log("get json error:", error);
  }
}

async function main() {
  await doLogin("admin", "admin");
  await sendRequest("message");
  let body = {
    message_flag: "GET_RCV_SMS_LOCAL",
    page_number: 1,
    data_per_page: 10,
  };
  let params = new URLSearchParams();
  params.append("message_flag", "GET_RCV_SMS_LOCAL");
  params.append("page_number", 1);
  params.append("data_per_page", 10);
  // await sendRequest("message", "post", params);
}

module.exports.main = main;
