// -------------------utils--------------------------
var devEnv = 0;
var AuthQop,
  username = "",
  passwd = "",
  GnCount = 1,
  Authrealm,
  Gnonce,
  nonce;
var _resetTimeOut = 600000;
var authHeaderIntervalID = 0;
var g_loginPasswd;
var devBusyState = false;
var g_bSimCardExist;
var statusInterval;
var afterRebootID;

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
function setLocalization(locale) {
  if (locale != "en") locale = "cn";

  try {
    jQuery.i18n.properties({
      name: "Messages",
      path: "properties/",
      mode: "map",
      language: locale,
      callback: function () {},
    });
  } catch (err) {
    var fileref = document.createElement("script");
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", "js/jquery/jquery.i18n.properties-1.0.4.js");
    document.getElementsByTagName("head")[0].appendChild(fileref);
    setLocalization(locale);
  }
}
function GetCookie(c_name) {
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + "=");
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(";", c_start);
      if (c_end == -1) c_end = document.cookie.length;
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
}
function resetInterval() {
  if (authHeaderIntervalID > 0) clearInterval(authHeaderIntervalID);
  authHeaderIntervalID = setInterval("clearAuthheader()", _resetTimeOut);
}
function clearAuthheader() {
  //clearing coockies
  Authheader = "";
  AuthQop = "";
  username = "";
  passwd = "";
  GnCount = "";
  Authrealm = "";
  //window.location.reload();
  window.location = "index.html";
}
function FormatDataTrafficMinUnitKB(dataByte) {
  var formatData;
  if (dataByte > 1024 * 1024 * 1024) {
    var dataInGB = dataByte / (1024 * 1024 * 1024);
    formatData = dataInGB.toFixed(2) + "GB";
  } else if (dataByte > 1024 * 1024) {
    var dataInMB = dataByte / (1024 * 1024);
    formatData = dataInMB.toFixed(2) + "MB";
  } else {
    var dataInKB = dataByte / 1024;
    formatData = dataInKB.toFixed(2) + "KB";
  }

  return formatData;
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
function setFocusID(id1, id) {
  if (document.getElementById(id1).value.toString().length == "3")
    document.getElementById(id).focus();
}
function setFocusMAC(id1, id) {
  if (document.getElementById(id1).value.toString().length == "2")
    document.getElementById(id).focus();
}
function setFocusIP(id1, id) {
  if (document.getElementById(id1).value.toString().length == "3")
    document.getElementById(id).focus();
}
function setAddBoxHeigth(objID) {
  $("#" + objID).css("height", $("body").height() + "px");
}
function drawPoint(bgCanvas, ctx_bg, maxH) {
  var bodyW = parseInt(document.body.offsetWidth);
  var windowW = parseInt($("#divAdminApp").width());
  var maxW = bodyW > windowW ? bodyW : windowW;

  var bgCanvasW;
  var bgCanvasH = maxH;
  if (bodyW < 430) {
    bgCanvasW = bodyW;
  } else {
    bgCanvasW = maxW;
  }
  bgCanvas.width = bgCanvasW;
  bgCanvas.height = bgCanvasH;
  var totalP = 7;
  var triangle = [
    [4, 48, 155, 160, 128, 0],
    [128, 0, 155, 160, 230, 45],
    [230, 45, 155, 160, 320, 235],
    [230, 45, 320, 235, 395, 140],
    [230, 45, 395, 140, 560, 0],
    [560, 0, 535, 128, 395, 140],
    [560, 0, 535, 128, 628, 80],
    [628, 80, 620, 270, 535, 128],
    [395, 140, 320, 235, 375, 270],
    [375, 270, 395, 140, 535, 128],
    [375, 270, 485, 355, 535, 128],
    [535, 128, 485, 355, 620, 270],
    [620, 270, 628, 439, 485, 355],
    [485, 355, 628, 439, 545, 515],
    [545, 515, 485, 355, 385, 415],
    [385, 415, 485, 355, 375, 270],
    [4, 48, 65, 140, -50, 95],
    [4, 48, 155, 160, 65, 140],
    [155, 160, 320, 235, 145, 305],
    [320, 235, 375, 270, 285, 385],
    [375, 270, 385, 415, 285, 385],
    [385, 415, 545, 515, 340, 510],
    [545, 515, 628, 439, 615, 590],
  ];
  var upPoint = [];
  var downPoint = [];

  ctx_bg.clearRect(0, 0, bgCanvasW, bgCanvasH);
  var pw = bgCanvasW - 628;
  if (bgCanvasW < maxWindowW) {
    pw = Math.floor(windowW / 3);
  }
  for (var i = 0; i < triangle.length; i++) {
    var x1, x2, y1, y2, x3, y3;
    x1 = pw + triangle[i][0];
    y1 = triangle[i][1];
    x2 = pw + triangle[i][2];
    y2 = triangle[i][3];
    x3 = pw + triangle[i][4];
    y3 = triangle[i][5];
    ctx_bg.beginPath();
    ctx_bg.save();
    var lGrd = ctx_bg.createLinearGradient(x1, y1, x3, y3);
    lGrd.addColorStop(0, "#000");
    lGrd.addColorStop(1, "#fff");
    ctx_bg.fillStyle = lGrd;
    ctx_bg.globalAlpha = 0.1;
    ctx_bg.moveTo(x1, y1);
    ctx_bg.lineTo(x2, y2);
    ctx_bg.lineTo(x3, y3);
    ctx_bg.lineTo(x1, y1);
    ctx_bg.fill();
    ctx_bg.restore();
    ctx_bg.closePath();

    if (i > 0) {
      ctx_bg.beginPath();
      ctx_bg.save();
      ctx_bg.strokeStyle = "#000";
      ctx_bg.globalAlpha = 0.2;

      // ctx_bg.rotate(GetRandomNum(1,20)*0.1*Math.PI);
      // var sc=GetRandomNum(5,8)*0.1;
      var sc, transY;
      if (i % 3 == 1) {
        sc = 0.6;
        transY = 30;
      } else if (i % 4 == 1) {
        sc = 0.5;
        transY = 20;
      } else if (i % 5 == 1) {
        sc = 0.7;
        transY = 10;
      } else {
        sc = 0.8;
        transY = 50;
      }
      ctx_bg.scale(sc, sc);
      ctx_bg.translate(pw - 100, transY);
      ctx_bg.moveTo(x1, y1);
      ctx_bg.lineTo(x2, y2);
      ctx_bg.lineTo(x3, y3);
      ctx_bg.lineTo(x1, y1);
      ctx_bg.stroke();

      ctx_bg.restore();
      ctx_bg.closePath();
    }
  }
}
function drawTriangle(maxH) {
  var bgCanvas = document.getElementById("bgCanvas");
  var ctx_bg = bgCanvas.getContext("2d");
  drawPoint(bgCanvas, ctx_bg, maxH);
  if (document.getElementById("bgCanvas1")) {
    var bgCanvas1 = document.getElementById("bgCanvas1");
    var ctx_bg1 = bgCanvas1.getContext("2d");
    drawPoint(bgCanvas1, ctx_bg1, maxH);
  }
}
function GetRandomNum(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  return Min + Math.round(Rand * Range);
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
function doLogin(username1, passwd1) {
  var url =
    window.location.protocol + "//" + window.location.host + "/login.cgi";
  var loginParam = getAuthType(url);
  //alert(loginParam);
  if (loginParam != null) {
    var loginParamArray = loginParam.split(" ");
    if (loginParamArray[0] == "Digest") {
      //nonce="718337c309eacc5dc1d2558936225417", qop="auth"
      Authrealm = getValue(loginParamArray[1]);
      nonce = getValue(loginParamArray[2]);
      AuthQop = getValue(loginParamArray[3]);

      //    alert("nonce :" + nonce);
      //    alert("AuthQop :" + AuthQop);
      //    alert("Authrealm :" + Authrealm);

      username = username1;
      passwd = passwd1;
      var rand, date, salt, strResponse;

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
        window.location.protocol +
        "//" +
        window.location.host +
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
      if (login_done(authentication(url))) {
        strResponse =
          'Digest username="' +
          username +
          '", realm="' +
          Authrealm +
          '", nonce="' +
          nonce +
          '", uri="' +
          "/cgi/protected.cgi" +
          '", response="' +
          DigestRes +
          '", qop=' +
          AuthQop +
          ", nc=00000001" +
          ', cnonce="' +
          AuthCnonce +
          '"';

        return 1;
      } else {
        // show error message...
        return 0;
      }

      return strResponse;
    }
  }
  return -1;
}
function getAuthType(url) {
  if (devEnv == "1") {
    return 'Digest realm="Highwmg", nonce="718337c309eacc5dc1d2558936225417", qop="auth" Content-Type: text/html Server: Lighttpd/1.4.19 Content-Length: 0 Date: Tue, 11 Oct 2005 10:44:32 GMT ';
  }
  var content = $.ajax({
    url: url,
    type: "GET",
    dataType: "text/html",
    async: false,
    cache: false,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Expires", "-1");
      xhr.setRequestHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate"
      );
      xhr.setRequestHeader("Pragma", "no-cache");
    },
  }).getResponseHeader("WWW-Authenticate");
  return content;
}
function authentication(url) {
  if (devEnv == "1") {
    return "200 OK";
  }
  var content = $.ajax({
    url: url,
    dataType: "text/html",
    async: false,
    cache: false,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", getAuthHeader("GET"));
      xhr.setRequestHeader("Expires", "-1");
      xhr.setRequestHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate"
      );
      xhr.setRequestHeader("Pragma", "no-cache");
    },
  }).responseText;
  return content;
}
function GetBrowserType() {
  var usrAgent = navigator.userAgent;
  if (navigator.userAgent.indexOf("MSIE") > 0) {
    var b_version = navigator.appVersion;
    var version = b_version.split(";");
    var trim_Version = version[1].replace(/[ ]/g, "");
    if (trim_Version == "MSIE6.0") {
      return "IE6";
    } else if (trim_Version == "MSIE7.0") {
      return "IE7";
    } else if (trim_Version == "MSIE8.0") {
      return "IE8";
    } else if (trim_Version == "MSIE9.0") {
      return "IE9";
    }
  }
  if ((isFirefox = navigator.userAgent.indexOf("Firefox") > 0)) {
    return "Firefox";
  }
  if ((isSafari = navigator.userAgent.indexOf("Safari") > 0)) {
    return "Safari"; //google
  }
  if ((isCamino = navigator.userAgent.indexOf("Camino") > 0)) {
    return "Camino";
  }
  if ((isMozilla = navigator.userAgent.indexOf("Gecko/") > 0)) {
    return "Gecko";
  }
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
  var rand, date, salt, strAuthHeader;
  var tmp, DigestRes, AuthCnonce_f;
  var HA1, HA2;

  HA1 = hex_md5(username + ":" + Authrealm + ":" + passwd);
  HA2 = hex_md5(requestType + ":" + "/cgi/xml_action.cgi");

  rand = Math.floor(Math.random() * 100001);
  date = new Date().getTime();

  salt = rand + "" + date;
  tmp = hex_md5(salt);
  AuthCnonce_f = tmp.substring(0, 16);
  //AuthCnonce_f = tmp;

  var strhex = hex(GnCount);
  var temp = "0000000000" + strhex;
  var Authcount = temp.substring(temp.length - 8);
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
function CallHtmlFile(htmlName) {
  // prevent loading html file from cache to avoid "304 not modified error."
  htmlName = htmlName + "?t=" + new Date().getTime().toString();

  resetInterval();
  var content;
  content = $.ajax({
    type: "GET",
    url: htmlName,
    dataType: "html",
    timeout: 30000,
    async: false,
  }).responseText;
  return content;
}
function getTimeToS(s) {
  var hh, mm, ss;

  hh =
    s >= 3600
      ? Math.floor(s / 3600) >= 10
        ? Math.floor(s / 3600)
        : "0" + Math.floor(s / 3600)
      : "00";
  mm =
    s >= 60
      ? Math.floor((s % 3600) / 60) >= 10
        ? Math.floor((s % 3600) / 60)
        : "0" + Math.floor((s % 3600) / 60)
      : "00";
  ss = s > 0 ? (s % 60 >= 10 ? s % 60 : "0" + (s % 60)) : "00";
  return hh + ":" + mm + ":" + ss;
}
function setFocus(controlID) {
  var str = document.getElementById(controlID).value;
  if (str.length == 2) {
    var c = controlID.toString().charAt(controlID.length - 1);
    c++;
    controlID = controlID.substring(0, controlID.length - 1);
    controlID = controlID + c;
    document.getElementById(controlID.toString()).focus();
  }
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
function getHeader(AuthMethod, file) {
  var rand, date, salt, setResponse;
  var tmp, DigestRes, AuthCnonce_f;
  var HA1, HA2;

  HA1 = hex_md5(username + ":" + Authrealm + ":" + passwd);
  HA2 = hex_md5(AuthMethod + ":" + "/cgi/xml_action.cgi");

  rand = Math.floor();
  date = new Date().getTime();

  salt = rand + "" + date;
  tmp = hex_md5(salt);
  AuthCnonce = tmp.substring(0, 16);
  AuthCnonce_f = tmp;

  var strhex = hex(GnCount);
  var temp = "0000000000" + strhex;
  var Authcount = temp.substring(temp.length - 8);

  DigestRes = hex_md5(
    HA1 +
      ":" +
      Gnonce +
      ":" +
      Authcount +
      ":" +
      AuthCnonce_f +
      ":" +
      AuthQop +
      ":" +
      HA2
  );

  ++GnCount;

  if ("GET" == AuthMethod) {
    if ("upgrade" == file) {
      //setResponse = "/login.cgi?Action=Upload&file=" + file + "&username=" +  username + "&realm=" + Authrealm + "&nonce=" + Gnonce + "&response=" +  DigestRes + "&cnonce=" + AuthCnonce_f + "&nc=" + Authcount + "&qop=" + AuthQop + "&temp=marvell";
      setResponse = "/xml_action.cgi?Action=Upload&file=upgrade&command=";
    } else if ("config_backup" == file) {
      setResponse =
        "/xml_action.cgi?Action=Upload&file=backfile&config_backup=";
    } else {
      setResponse =
        "/login.cgi?Action=Download&file=" +
        file +
        "&username=" +
        username +
        "&realm=" +
        Authrealm +
        "&nonce=" +
        Gnonce +
        "&response=" +
        DigestRes +
        "&cnonce=" +
        AuthCnonce_f +
        "&nc=" +
        Authcount +
        "&qop=" +
        AuthQop +
        "&temp=marvell";
    }
  }

  if ("POST" == AuthMethod) {
    setResponse =
      "/login.cgi?Action=Upload&file=" +
      file +
      "&username=" +
      username +
      "&realm=" +
      Authrealm +
      "&nonce=" +
      Gnonce +
      "&response=" +
      DigestRes +
      "&cnonce=" +
      AuthCnonce_f +
      "&nc=" +
      Authcount +
      "&qop=" +
      AuthQop +
      "&temp=marvell";
  }

  return setResponse;
}
function getAuthHeaderEx(requestType, file) {
  // return getCookie("Authheader");
  var rand, date, salt, strAuthHeader;
  var tmp, DigestRes, AuthCnonce_f;
  var HA1, HA2;

  HA1 = hex_md5(username + ":" + Authrealm + ":" + passwd);
  HA2 = hex_md5(requestType + ":" + "/cgi/xml_action.cgi");

  rand = Math.floor(Math.random() * 100001);
  date = new Date().getTime();

  salt = rand + "" + date;
  tmp = hex_md5(salt);
  AuthCnonce_f = tmp.substring(0, 16);
  //AuthCnonce_f = tmp;

  var strhex = hex(GnCount);
  var temp = "0000000000" + strhex;
  var Authcount = temp.substring(temp.length - 8);
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
    "username=" +
    username +
    "&realm=" +
    Authrealm +
    "&nonce=" +
    nonce +
    "&uri=/cgi/xml_action.cgi" +
    "&response=" +
    DigestRes +
    "&qop=" +
    AuthQop +
    "&nc=" +
    Authcount +
    "&cnonce=" +
    AuthCnonce_f;
  DigestHeader = strAuthHeader;
  return strAuthHeader;
}
// -------------------------------------------------------------validator-----------------------------------------------------------------

function IsNumber(obj) {
  if (typeof obj === "string") {
    var r = /^-?\d+$/;
    return r.test(obj);
  }
  if (typeof obj === "number") {
    if (obj.toString().indexOf(".") != -1) return false;
    else return true;
  }
  return false;
}
function IsNumber_1(obj) {
  if (typeof obj === "string") {
    var r = /^-?\d+$/;
    if (r.test(obj)) {
      return true;
    } else {
      return false;
    }
  }

  if (typeof obj === "number") {
    if (obj.toString().indexOf(".") != -1) return false;
    else return true;
  }
  return false;
}
function isIPv6Long(ip6Addr) {
  var matchStr =
    "((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*$";
  var ret = ip6Addr.match(matchStr);
  if (ret) {
    return true;
  } else {
    return false;
  }
}
function isIPFULL(inputString, flag) {
  var re = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  if (!flag) {
    if (inputString == "...") return true;
    else isIPFULL(inputString, true);
  }
  //test the input string against the regular expression
  if (re.test(inputString)) {
    //now, validate the separate parts
    var parts = inputString.split(".");
    if (parseInt(parseFloat(parts[0])) == 0) {
      return false;
    }
    if (parseInt(parseFloat(parts[3])) == 0 /*|| inputString=="192.168.0.1"*/) {
      return false;
    }
    for (var i = 0; i < parts.length; i++) {
      if (parseInt(parseFloat(parts[i])) > 255) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}
function IsInteger(str) {
  return /^\d+$/.test(str);
}
function isFloat(oNum) {
  if (!oNum) return false;
  var strP = /^\d+(\.\d+)?$/;
  if (!strP.test(oNum)) return false;
  try {
    if (parseFloat(oNum) != oNum) return false;
  } catch (ex) {
    return false;
  }
  return true;
}
function textBoxMinLength(control, value) {
  if (document.getElementById(control).value.length < value) return false;
  else return true;
}
function IsChineseChar(value) {
  if (/.*[\u0100-\uffff]+.*$/.test(value)) {
    return true;
  } else {
    return false;
  }
}
function textBoxMaxLength(control, value) {
  if (document.getElementById(control).value.length > value) return false;
  else return true;
}
function textBoxLength(control, value) {
  if (document.getElementById(control).value.length == value) return true;
  else return false;
}
function IsEmail(emailAddr) {
  var pattern =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (pattern.test(emailAddr)) {
    return true;
  } else {
    return false;
  }
}
function IsVPNName(vpnNmae) {
  var pattern = /^[a-zA-Z0-9]{4,20}$/;
  if (pattern.test(vpnNmae)) {
    return true;
  } else {
    return false;
  }
}
function IsPhoneNumber(phoneNumber) {
  var pattern =
    /(^[0-9]{3,4}\-[0-9]{3,8}$)|(^\+?[0-9]{3,15}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)/;
  if (pattern.test(phoneNumber)) {
    return true;
  } else {
    return false;
  }
}
function isChineseChar(value) {
  if (/.*[\u0100-\uffff]+.*$/.test(value)) {
    return true;
  } else {
    return false;
  }
}
function deviceNameValidation(str) {
  if (isChineseChar(str)) {
    return false;
  }

  if (str.toString().indexOf("#") != -1) return false;
  else if (str.toString().indexOf(":") != -1) return false;
  else if (str.toString().indexOf(" ") != -1) return false;
  else if (str.toString().indexOf("&") != -1) return false;
  else if (str.toString().indexOf(";") != -1) return false;
  else if (str.toString().indexOf("~") != -1) return false;
  else if (str.toString().indexOf("|") != -1) return false;
  else if (str.toString().indexOf("<") != -1) return false;
  else if (str.toString().indexOf(">") != -1) return false;
  else if (str.toString().indexOf("$") != -1) return false;
  else if (str.toString().indexOf("%") != -1) return false;
  else if (str.toString().indexOf("^") != -1) return false;
  else if (str.toString().indexOf("!") != -1) return false;
  else if (str.toString().indexOf("@") != -1) return false;
  else if (str.toString().indexOf(",") != -1) return false;
  else if (str.toString().indexOf("(") != -1) return false;
  else if (str.toString().indexOf(")") != -1) return false;
  else if (str.toString().indexOf("{") != -1) return false;
  else if (str.toString().indexOf("}") != -1) return false;
  else if (str.toString().indexOf("[") != -1) return false;
  else if (str.toString().indexOf("]") != -1) return false;
  else if (str.toString().indexOf("*") != -1) return false;
  else return true;
}
function IsIPv6(ipv6Addr) {
  return ipv6Addr.match(/:/g) != null &&
    ipv6Addr.match(/:/g).length <= 15 &&
    /::/.test(str)
    ? /^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i.test(str)
    : /^([\da-f]{1,4}:){15}[\da-f]{1,4}$/i.test(str);
}
function IsIPv4(ipv4Addr) {
  var exp =
    /^([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])$/;
  return null == ipv4Addr.match(exp) ? false : true;
}
function IsUrl(strUrl) {
  var regUrl = /(http\:\/\/)?([\w.]+)(\/[\w- \.\/\?%&=]*)?/gi;
  if (regUrl.test(strUrl)) {
    return true;
  } else {
    return false;
  }
}
function IsHexStr(str) {
  pattern = /^[0-9a-fA-F]+$/;
  if (pattern.test(str)) {
    return true;
  } else {
    return false;
  }
}
function IsASCIIStr(str) {
  pattern = /[0-9a-zA-Z]+/;
  if (pattern.test(str)) {
    return true;
  } else {
    return false;
  }
}
function IsEnglishLetter(str) {
  pattern = /[a-zA-Z]+/;
  if (pattern.test(str)) {
    return true;
  } else {
    return false;
  }
}
function IsMACAddr(mac) {
  var regex = /^([0-9a-f]{2}([:-]|$)){6}$|([0-9a-f]{4}([.]|$)){3}$/i;
  if (!regex.test(mac)) return false;
  else return true;
}
//time format: hh:mm:ss
function IsTime(time) {
  var regex = /^([0-1]?\d{1}|2[0-3]):[0-5]?\d{1}:([0-5]?\d{1})$/;
  if (!regex.test(time)) return false;
  else return true;
}
//time format: hh:mm
function IsTimeEx(time) {
  //var regex = /^(([0-1]\d)|(2[0-4])):[0-5]\d$/;
  var regex = /^([0-9]|[0-1]{1}\d|2[0-3]):([0-9]|[0-5]\d)$/;
  if (!regex.test(time)) return false;
  else return true;
}
//date format: yyyy-mm-dd
function IsData(date) {
  var month = "";
  var year = "";
  if (date) {
    var data = date.split("-");
    year = data[0];
    month = data[1] * 1;
  }
  return (
    new Date(date.replace(/-/g, "/")).getDate() ==
      date.substring(date.length - 2) &&
    month <= 12 &&
    month > 0 &&
    year.indexOf("0") != 0
  );
}
//port format: xxxx:yyyy
function IsPort(port) {
  var portArr = port.split(":");
  for (var idx = 0; idx < 2; ++idx) {
    if ("" == portArr[idx] || !/^[1-9]+\d*$/.test(portArr[idx])) return false;

    if (portArr[idx] > 65535 || portArr[idx] < 0) return false;
  }
  if (Number(portArr[0]) > Number(portArr[1])) return false;

  return true;
}
function IsRuleName(ruleName) {
  if ("" == ruleName) return false;
  if (!IsASCIIStr(ruleName)) return false;

  return true;
}
function validate_pin(pin) {
  var ret = true;

  if (pin.length < 4 || pin.length > 8) ret = false;

  if (!IsNumber(pin)) ret = false;

  return ret;
}
function validate_puk(puk) {
  var ret = true;

  if (puk.length < 4 || puk.length > 10) ret = false;

  if (/\W/.test(puk)) ret = false;

  return ret;
}
function isAfterDate(beforeDate, afterDate) {
  var bDate = beforeDate.split("-");
  var aDate = afterDate.split("-");
  if (parseInt(bDate[0]) > parseInt(aDate[0])) {
    return false;
  } else if (parseInt(bDate[0]) < parseInt(aDate[0])) {
    return true;
  } else {
    if (parseInt(bDate[1]) > parseInt(aDate[1])) {
      return false;
    } else if (parseInt(bDate[1]) < parseInt(aDate[1])) {
      return true;
    } else {
      if (parseInt(bDate[2]) >= parseInt(aDate[2])) {
        return false;
      } else {
        return true;
      }
    }
  }
}
function isAfterTime(beforeTime, afterTime) {
  var bTime = beforeTime.split(":");
  var aTime = afterTime.split(":");
  if (parseInt(bTime[0]) > parseInt(aTime[0])) {
    return false;
  } else if (parseInt(bTime[0]) < parseInt(aTime[0])) {
    return true;
  } else {
    if (bTime.length == 2) {
      if (parseInt(bTime[1]) >= parseInt(aTime[1])) {
        return false;
      } else {
        return true;
      }
    } else {
      if (parseInt(bTime[1]) > parseInt(aTime[1])) {
        return false;
      } else if (parseInt(bTime[1]) < parseInt(aTime[1])) {
        return true;
      } else {
        if (parseInt(bTime[2]) >= parseInt(aTime[2])) {
          return false;
        } else {
          return true;
        }
      }
    }
  }
}
function validateMACAddress(mac) {
  var regex = /^([0-9a-f]{2}([:-]|$)){6}$|([0-9a-f]{4}([.]|$)){3}$/i;
  if (!regex.test(mac)) return false;
  else return true;
}
function validateIPAddress(ip) {
  if (!isIPFULL(ip, true)) return 0;
  else return 1;
}
// -------------------------------------------------------------ajax.js-----------------------------------------------------------------

function postJSONlocale(xmlName, jsonData) {
  resetInterval();
  var url = "";
  xmlName = "json_" + xmlName;
  var host = window.location.protocol + "//" + window.location.host + "/";
  url =
    host +
    "xml_action.cgi?method=post&module=duster&file=" +
    xmlName +
    Date.parse(new Date());
  $.ajax({
    type: "POST",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", getAuthHeader("POST"));
    },
    url: url,
    processData: false,
    data: JSON.stringify(jsonData),
    async: false,
    dataType: "json",
    timeout: 3000,
    success: function (data, textStatus) {},
    complete: function (XMLHttpRequest, textStatus) {},
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (textStatus != "timeout") alert(errorThrown);
      else alert(jQuery.i18n.prop("lErrorTimeOut"));
    },
  });
  return true;
}
function callJSON(jsonName, callbackFun) {
  resetInterval();
  var url = "";
  jsonName = "json_" + jsonName;
  var host = window.location.protocol + "//" + window.location.host + "/";
  var ctx;
  url =
    host +
    "xml_action.cgi?method=get&module=duster&file=" +
    jsonName +
    Date.parse(new Date());

  $.ajax({
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", getAuthHeader("GET"));
    },
    url: url,
    timeout: 30000,
    dataType: "json",
    async: true,
    success: function (data, textStatus) {},
    complete: function (XMLHttpRequest, textStatus) {
      var firstNewSmsContent = XMLHttpRequest.responseText;
      if (firstNewSmsContent) {
        var firstNewSmsString = firstNewSmsContent.substring(
          firstNewSmsContent.indexOf("{"),
          firstNewSmsContent.lastIndexOf("}") + 1
        );
        if (
          firstNewSmsString.indexOf("UNAUTHORIZED") > 0 ||
          firstNewSmsString.indexOf("KICKOFF") > 0
        ) {
          clearAuthheader();
        } else {
          ctx = JSON.parse(firstNewSmsString);
          if (callbackFun) {
            callbackFun(ctx);
          }
        }
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {},
  });
}
function postJSON(jsonName, jsonData, callbackFun, timeOutInterval) {
  if (timeOutInterval === undefined || timeOutInterval === null) {
    timeOutInterval = 360000;
  }
  resetInterval();
  var url = "";
  jsonName = "json_" + jsonName;
  var host = window.location.protocol + "//" + window.location.host + "/";
  url =
    host +
    "xml_action.cgi?method=post&module=duster&file=" +
    jsonName +
    Date.parse(new Date());
  $.ajax({
    type: "POST",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", getAuthHeader("POST"));
    },
    url: url,
    dataType: "json",
    processData: false,
    async: true,
    data: JSON.stringify(jsonData),
    success: function (data, textStatus) {},
    complete: function (XMLHttpRequest, textStatus) {
      closeWait();
      var firstNewSmsContent = XMLHttpRequest.responseText;
      if (firstNewSmsContent) {
        var firstNewSmsString = firstNewSmsContent.substring(
          firstNewSmsContent.indexOf("{"),
          firstNewSmsContent.lastIndexOf("}") + 1
        );
        if (
          firstNewSmsString.indexOf("UNAUTHORIZED") > 0 ||
          firstNewSmsString.indexOf("KICKOFF") > 0
        ) {
          clearAuthheader();
        } else {
          ctx = JSON.parse(firstNewSmsString);
          if (callbackFun) {
            callbackFun(ctx);
          }
        }
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      closeWait();
      // if(textStatus!="timeout"){
      //     alert(jQuery.i18n.prop('lErrorPost'));
      // }else{
      //     alert(jQuery.i18n.prop('lErrorTimeOut'));
      // }
    },
  });
}
// -------------------------------------------------------------adminApp.js-----------------------------------------------------------------
var menu = {
  Menu: [
    { name: "mDashboard", implFunction: "objDashboard" },
    {
      name: "tInternet",
      subMenu: [
        { id: "mInternetConn", implFunction: "objInternetConn" },
        { id: "mManulNetwork", implFunction: "objManualNetwork" },
        { id: "mPinPuk", implFunction: "objPinPuk" },
        { id: "mDeviceInfo", implFunction: "objDeviceInfo" },
      ],
    },
    {
      name: "tHome_Network",
      subMenu: [
        { id: "mDHCP_Settings", implFunction: "objDHCP_Settings" },
        { id: "mConnected_Devices", implFunction: "objConnectedDev" },
        { id: "mDataTraffic", implFunction: "objDataTraffic" },
        { id: "mTrafficStatistical", implFunction: "objTrafficStatistical" },
        // {"id":"mTrafficSetting","implFunction":"objTrafficSetting"},
        { id: "mNetworkActivity", implFunction: "objNetworkActivity" },
      ],
    },
    {
      name: "tPhoneBook",
      subMenu: [
        { id: "mAllContact", implFunction: "objPhoneBook" },
        { id: "mLoactionCommon", implFunction: "objPhoneBook" },
        { id: "mLoactionFamliy", implFunction: "objPhoneBook" },
        { id: "mLoactionFriends", implFunction: "objPhoneBook" },
        { id: "mLoactionColleague", implFunction: "objPhoneBook" },
      ],
    },
    {
      name: "tSms",
      subMenu: [
        { id: "mDeviceInbox", implFunction: "objSms" },
        { id: "mSmsOutbox", implFunction: "objSms" },
        { id: "mSmsDrafts", implFunction: "objSms" },
        { id: "mSim", implFunction: "objSms" },
        { id: "mSmsSet", implFunction: "objSmsSet" },
      ],
    },
    {
      name: "tWireless",
      subMenu: [
        { id: "mWifiInfoSet", implFunction: "objWifiSet" },
        { id: "mWPS", implFunction: "objWPS" },
        { id: "mWifiMACFilter", implFunction: "objWifiMACFilter" },
        { id: "mCustomFirewallRules", implFunction: "objCustomFirewallRules" },
        { id: "mPortFilter", implFunction: "objPortFilter" },
        { id: "mPortForwarding", implFunction: "objPortForwarding" },
      ],
    },
    {
      name: "tRouter",
      subMenu: [
        { id: "mRouterManage", implFunction: "objRouterManage" },
        { id: "mAccountManage", implFunction: "objAccountManage" },
        { id: "mSoftUpdate", implFunction: "objUpdate" },
        { id: "mConfManage", implFunction: "objConfManage" },
        { id: "mAPN", implFunction: "objAPN" },
        { id: "mTimeSetting", implFunction: "objTimeSetting" },
      ],
    },
  ],
};
var dashboard_interval;
var maxWindowW = 430;
var LANGUAGE = "en";
(function ($) {
  $.objAdmin = function () {
    var that = this;
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.showMenu();
        that.bindMenuClose();
      }
    };
    this.showMenu = function () {
      var menuList =
        '<li style="width:134.5px;" ><a href="#" class="on" id="mDashboard" onclick="displaySubMenu(0)">' +
        jQuery.i18n.prop("mDashboard") +
        "</a></li>";
      var index = 1;
      for (var i = 1; i < menu.Menu.length; i++) {
        var l = menu.Menu[i];
        var MenuName = jQuery.i18n.prop(l.name);
        var lname = l.name;
        menuList +=
          '<li style="width:134.5px;" ><a href="#" id="' +
          lname +
          '" onclick="displaySubMenu(' +
          index +
          ')">' +
          MenuName +
          "</a></li>";
        index++;
      }
      $("#menu").html(menuList);
      displaySubMenu(0);

      $("#media_menu").unbind("click");
      $("#media_menu").bind("click", function () {
        $("#leftBar").hide();
        if ($("#navigation").css("display") == "none") {
          $("#navigation").show();
        } else {
          $("#navigation").hide();
        }
      });
      $("#media_sub_menu").unbind("click");
      $("#media_sub_menu").bind("click", function () {
        $("#navigation").hide();
        if ($("#leftBar").css("display") == "none") {
          $("#leftBar").show();
        } else {
          $("#leftBar").hide();
        }
      });
    };
    this.bindMenuClose = function () {
      $("#menu_bg").unbind("click");
      $("#menu_bg").bind("click", function () {
        if ($("#navigation").css("display") != "none") {
          $("#navigation").hide();
        }
      });
    };
    this.displayControls = function () {
      document.getElementById("MainHelp").innerHTML =
        jQuery.i18n.prop("helpName");
      document.getElementById("MainLogOut").innerHTML =
        jQuery.i18n.prop("LogOutName");
      document.getElementById("lPleaseWait").innerHTML =
        jQuery.i18n.prop("h1PleaseWait");
      document.getElementById("lt_lacopyright_main").innerHTML =
        jQuery.i18n.prop("lt_lacopyright");
      document.getElementById("lt_lacopyright").innerHTML =
        jQuery.i18n.prop("lt_lacopyright");
    };
    return this;
  };
})(jQuery);

var MenuId = "";
var SubMenuId = "";
function displaySubMenu(index) {
  var subbox =
    '<div class="leftBar" id="leftBar"><div class="leftBar_bg" id="leftBar_bg"></div><ul class="leftMenu" id="submenu"></ul></div><div id="Content" class="content"></div><br class="clear" /><br class="clear" />';
  $("#mainColumn").html(subbox);
  switch (index) {
    case 0:
      MenuId = "mDashboard";
      break;
    case 1:
      MenuId = "tInternet";
      break;
    case 2:
      MenuId = "tHome_Network";
      break;
    case 3:
      MenuId = "tPhoneBook";
      break;
    case 4:
      MenuId = "tSms";
      break;
    case 5:
      MenuId = "tWireless";
      break;
    case 6:
      MenuId = "tRouter";
      break;
  }
  $("#menu li a").removeClass("on");
  $("#" + MenuId).addClass("on");
  var subMenuList = "";
  var subId = "";
  for (var i = 0; i < menu.Menu.length; i++) {
    if (menu.Menu[i].name == MenuId && MenuId != "mDashboard") {
      subId = menu.Menu[i].subMenu[0].id;
      for (var j = 0; j < menu.Menu[i].subMenu.length; j++) {
        var l = menu.Menu[i].subMenu[j];
        var subMenuName = jQuery.i18n.prop(l.id);
        subMenuList +=
          '<li class="" id="' +
          l.id +
          '" onclick="displaySubContent(\'' +
          l.id +
          '\')"><a href="#">' +
          subMenuName +
          "</a></li>";
      }
      break;
    }
  }

  if (MenuId == "mDashboard") {
    $("#mainColumn").html(CallHtmlFile("html/dashboard.html"));
    $("#mainColumn").show();
    $.objDashboard().onLoad(true);
    clearInterval(dashboard_interval);
    dashboard_interval = setInterval(function () {
      $.objDashboard().onLoad(false);
    }, 5000);
    $("#media_sub_menu").hide();
  } else {
    clearInterval(dashboard_interval);
    $("#submenu").html(subMenuList);
    displaySubContent(subId);
    var bodyW = parseInt(document.body.offsetWidth);
    var windowW = parseInt($(".liginbox").width());
    if (bodyW < maxWindowW && windowW < maxWindowW) {
      $("#media_sub_menu").show();
    }
  }

  if ($("#media_menu").css("display") != "none") {
    $("#navigation").hide();
  }
  if ($("#media_sub_menu").css("display") != "none") {
    $("#leftBar").hide();
  }
  $("#leftBar_bg").css("width", parseInt(window.innerWidth) + "px");
  $("#leftBar_bg").unbind("click");
  $("#leftBar_bg").bind("click", function () {
    if ($("#leftBar").css("display") != "none") {
      $("#leftBar").hide();
    }
  });
}
function displaySubContent(obj) {
  SubMenuId = obj;
  $("#submenu li").removeClass("left_on");
  $("#" + obj).addClass("left_on");
  var menuid = obj;
  var implFun = "";
  for (var i = 1; i < menu.Menu.length; i++) {
    for (var j = 0; j < menu.Menu[i].subMenu.length; j++) {
      var l = menu.Menu[i].subMenu[j];
      if (l.id == obj && obj != "mDashboard") {
        menuid = menu.Menu[i].name;
        implFun = l.implFunction;
        break;
      }
    }
  }
  var path = "";
  switch (menuid) {
    case "tInternet":
      path = "html/internet";
      break;
    case "tHome_Network":
      path = "html/homeNetwork";
      break;
    case "tPhoneBook":
      path = "html/phoneBook/mPhoneBook.html";
      document.getElementById("Content").innerHTML = CallHtmlFile(path);
      eval("$." + implFun + "().onLoad(true)");
      return;
    case "tSms":
      if (SubMenuId == "mSmsSet") {
        path = "html/sms/mSmsSet.html";
        document.getElementById("Content").innerHTML = CallHtmlFile(path);
        $.objSmsSet().onLoad(true);
        return;
      }
      path = "html/sms/mSms.html";
      document.getElementById("Content").innerHTML = CallHtmlFile(path);
      $.objSms().onLoad(true);
      return;
    case "tWireless":
      path = "html/wifi";
      break;
    case "tRouter":
      path = "html/router";
      break;
  }
  path = path + "/" + obj + ".html";
  document.getElementById("Content").innerHTML = CallHtmlFile(path);
  eval("$." + implFun + "().onLoad(true)");

  if ($("#media_menu").css("display") != "none") {
    $("#navigation").hide();
  }
  if ($("#media_sub_menu").css("display") != "none") {
    $("#leftBar").hide();
  }
}
function dashboardOnClick(obj) {
  $("#menu li a").removeClass("on");
  var menuid = obj;
  var subMenuList = "";
  for (var i = 0; i < menu.Menu.length; i++) {
    for (var j = 0; j < menu.Menu.subMenu.length; j++) {}
  }
  $("#" + menuid).addClass("on");
}
function logOut() {
  var host = window.location.protocol + "//" + window.location.host + "/";
  var url = host + "xml_action.cgi?Action=logout";
  $.ajax({
    type: "GET",
    url: url,
    dataType: "html",
    async: false,
    complete: function () {
      clearAuthheader();
    },
  });
  return true;
}
function getHelp(helpPage) {
  var htmlFilename = "help_" + LANGUAGE + ".html";
  var host = window.location.protocol + "//" + window.location.host + "/";
  var url = host + htmlFilename + "#" + helpPage;

  var helpWindow = window.open(url, "newwindow");
  helpWindow.focus();
}
function getMainHelp() {
  getHelp("");
}
function showWait() {
  setDlgStyle();
  $("#mbox").show();
}
function closeWait() {
  $("#mbox").hide();
}
function showBOX2(DlgTitle, DlgMsg, btn1_txt, btn2_txt, btn1_fun, bnt2_fun) {
  setDlgStyle();
  $("#lt_mbox2_title").html(DlgTitle);
  $("#lt_mbox2_msg").html(DlgMsg);
  $("#mbox2_btn1").val(btn1_txt);
  $("#mbox2_btn2").val(btn2_txt);
  $("#mbox2").show();
  $("#mbox2_btn1").unbind("click");
  $("#mbox2_btn1").bind("click", function () {
    if (btn1_fun) {
      btn1_fun();
    }
  });
  $("#mbox2_btn2").unbind("click");
  $("#mbox2_btn2").bind("click", function () {
    if (bnt2_fun) {
      bnt2_fun();
    }
  });
}
function CloseDlg() {
  $("#confirmDlg").hide();
}
function ClosemBOX2() {
  $("#mbox2").hide();
}
function showMsgBox(DlgTitle, DlgMsg) {
  setDlgStyle();
  $("#lt_confirmDlg_title").html(DlgTitle);
  $("#lt_confirmDlg_msg").html(DlgMsg);
  if (DlgMsg.length <= 40) {
    $("#lt_confirmDlg_msg").html("<br/><br/>" + DlgMsg);
  }
  $("#confirmDlg").show();
}
function MainquickSetup() {
  oneShowQuick = 2;

  $("#mainColumn").hide();
  $("#quickSetup_box").show();
  $.objQuickSetup().onLoad(true);
  if (MenuId == "mDashboard") {
    clearInterval(dashboard_interval);
  }

  setDlgStyle();
}
function uaredirect(f) {
  try {
    if (document.getElementById("bdmark") != null) {
      return;
    }
    var b = false;
    if (arguments[1]) {
      var e = window.location.host;
      var a = window.location.href;
      if (isSubdomain(arguments[1], e) == 1) {
        f = f + "/#m/" + a;
        b = true;
      } else {
        if (isSubdomain(arguments[1], e) == 2) {
          f = f + "/#m/" + a;
          b = true;
        } else {
          f = a;
          b = false;
        }
      }
    } else {
      b = true;
    }
    if (b) {
      var c = window.location.hash;
      if (!c.match("fromapp")) {
        if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
          return "yes";
        } else {
          return "no";
        }
      }
    }
  } catch (d) {}
}

function setDlgStyle() {
  var bodyW = parseInt(document.body.offsetWidth);
  var windowW = parseInt($("#divAdminApp").css("width"));
  var maxW = bodyW > windowW ? bodyW : windowW;
  var windowH = parseInt(window.innerHeight);
  var quickH = 0;
  if ($("#quickSetup_box").css("display") != "none") {
    quickH = parseInt($("#quickHeight").height()) + 170;
  }
  var leftBarH = parseInt($("#submenu").height()) + 170;
  var contentH = parseInt($("#Content").height()) + 170;
  var maxH = contentH;
  if (MenuId) {
    if ($("#quickSetup_box").css("display") != "none") {
      if (windowH > quickH && windowH > 600) {
        maxH = windowH;
      } else if (windowH < 600 && quickH < 600) {
        maxH = 600;
      } else if (quickH > windowH && quickH > 600) {
        maxH = quickH;
      }
      $("#quickBox").css("height", maxH - 170 + "px");
      if (bodyW < 430) {
        $("#quickBox").css("height", maxH - 150 + "px");
      }
    } else {
      if (windowH < 600 && leftBarH < 600 && contentH < 600) {
        maxH = 600;
      } else if (windowH > leftBarH && windowH > contentH && windowH > 600) {
        maxH = windowH;
      } else if (leftBarH > windowH && leftBarH > contentH && leftBarH > 600) {
        maxH = leftBarH;
      } else if (contentH > windowH && contentH > leftBarH && contentH > 600) {
        maxH = contentH;
      }
    }
    if (MenuId != "mDashboard") {
      $("#mainColumn").css("min-height", parseInt(maxH - 150) + "px");
      if (bodyW < 430) {
        $("#mainColumn").css("min-height", parseInt(maxH - 140) + "px");
      }
    } else {
      $("#mainColumn").css("min-height", "auto");
      if ($("#quickSetup_box").css("display") == "none") {
        maxH = 974;
        if (bodyW < 430 && uaredirect("index.html") == "yes") {
          maxH = 1373;
        } else if (bodyW > 430 && uaredirect("index.html") == "yes") {
          maxH = 993;
        }
      }
    }
  } else {
    maxH = 600;
  }

  drawTriangle(maxH);
  $("#mbox").css("height", maxH + "px");
  $("#confirmDlg").css("height", maxH + "px");
  $("#mbox2").css("height", maxH + "px");
  $("#mbox1").css("height", maxH + "px");
  $(".popUpBox.popUpBox2")
    .parent()
    .css("height", maxH + "px");
  $("#menu_bg").css("height", maxH + "px");
  $("#leftBar_bg").css("height", maxH + "px");

  if (bodyW > windowW) {
    $(".loginArea").css("left", bodyW - 150 + "px");
  } else {
    $(".loginArea").css("left", "1050px");
  }
  if (bodyW < 430) {
    $("#media_menu").show();
    $("#leftBar").hide();
    if (MenuId && MenuId != "mDashboard") {
      $("#media_sub_menu").show();
    } else {
      $("#media_sub_menu").hide();
    }
    $(".loginArea").css("left", "0px");
    $("#mbox").css("width", bodyW + "px");
    $("#confirmDlg").css("width", bodyW + "px");
    $("#mbox2").css("width", bodyW + "px");
    $("#mbox1").css("width", bodyW + "px");
    $(".popUpBox.popUpBox2")
      .parent()
      .css("width", bodyW + "px");
    $("#menu_bg").css("width", bodyW + "px");
    $("#leftBar_bg").css("width", bodyW + "px");
    $("#quickSetup_box").css("width", bodyW + "px");
    return;
  } else if (
    bodyW > 430 &&
    bodyW <= 1200 &&
    uaredirect("index.html") == "yes"
  ) {
    maxW = 1200;
  }

  $("#media_menu").hide();
  $("#media_sub_menu").hide();
  $("#navigation").show();
  if (MenuId && MenuId != "mDashboard") {
    $("#leftBar").show();
  } else {
    $("#leftBar").hide();
  }
  $("#mbox").css("width", maxW + "px");
  $("#confirmDlg").css("width", maxW + "px");
  $("#mbox2").css("width", maxW + "px");
  $("#mbox1").css("width", maxW + "px");
  $(".popUpBox.popUpBox2")
    .parent()
    .css("width", maxW + "px");
  $("#menu_bg").css("width", maxW + "px");
  $("#leftBar_bg").css("width", maxW + "px");
  $("#quickSetup_box").css("width", maxW + "px");
}
function afterRebootConf() {
  closeWait();
  clearInterval(afterRebootID);
  clearAuthheader();
}
// -------------------------------------------------------------objDashboard-----------------------------------------------------------------

quickNowPage = "divQsUserNamePage";
var oneShowQuick = 0;
var sSpeedArr = [];
var rSpeedArr = [];
(function ($) {
  $.objDashboard = function () {
    var that = this;
    this.onLoad = function (flag) {
      if (flag) {
        setDlgStyle();
        that.displayControls();
        that.btnOpenClose();
        // $.objQuickSetup().onLoad(true);
      }
      that.showData();
      setDlgStyle();
    };
    this.btnOpenClose = function () {
      $("#switchBtn_connStatus").unbind("click");
      $("#switchBtn_connStatus").bind("click", function () {
        var className = $("#switchBtn_connStatus").attr("class");
        var jsonData = {};
        if (className.indexOf("switchBtn_check") != -1) {
          jsonData.connect_disconnect = "disabled";
        } else {
          jsonData.connect_disconnect = "cellular";
        }
        showWait();
        setTimeout(function () {
          postJSON("status1", jsonData, function (data) {
            callJSON("status1", function (json) {
              if (json.connect_disconnect == "cellular") {
                $("#switchBtn_connStatus").addClass("switchBtn_check");
              } else {
                $("#switchBtn_connStatus").removeClass("switchBtn_check");
              }
            });
          });
        }, 100);
      });

      $("#switchBtn_wifiStatus").unbind("click");
      $("#switchBtn_wifiStatus").bind("click", function () {
        var className = $("#switchBtn_wifiStatus").attr("class");
        var jsonData = {};
        if (className.indexOf("switchBtn_check") != -1) {
          jsonData.wlan_enable = "0";
        } else {
          jsonData.wlan_enable = "1";
        }
        showWait();
        setTimeout(function () {
          postJSON("uapxb_wlan_basic_settings", jsonData, function (data) {
            callJSON("status1", function (json) {
              if (json.wlan_enable == "1") {
                $("#switchBtn_wifiStatus").addClass("switchBtn_check");
              } else {
                $("#switchBtn_wifiStatus").removeClass("switchBtn_check");
              }
            });
          });
        }, 100);
      });
    };
    this.showNA = function (str) {
      if (str == "" || str == null || str == undefined || str == "n/a") {
        return "N/A";
      } else {
        return str;
      }
    };
    this.showData = function () {
      callJSON("altair_state", function (json) {
        if (json.sms_unread_long_num != "0") {
          $("#lSms_read").attr("src", "images/unread.png");
          $("#lt_smsStatue_text").html(jQuery.i18n.prop("lUnread"));
        } else {
          $("#lSms_read").attr("src", "images/read.png");
          $("#lt_smsStatue_text").html(jQuery.i18n.prop("lReaded"));
        }

        that.signalShow(0);
        if (json.Battery_charging == "1") {
          $("#lDashChargeStatus").html(jQuery.i18n.prop("lCharging"));
        }
        if (json.Battery_charge == "0") {
          $("#lDashChargeStatus").html(jQuery.i18n.prop("lUncharged"));
        } else if (json.Battery_charge == "1") {
          $("#lDashChargeStatus").html(jQuery.i18n.prop("lCharging"));
        } else if (json.Battery_charge == "2") {
          $("#lDashChargeStatus").html(jQuery.i18n.prop("lFullycharged"));
        } else if (json.Battery_charge == "3") {
          $("#lDashChargeStatus").html(jQuery.i18n.prop("lFullycharged"));
        }
        //added by nt yecong 180516 for temp test
        //alert(Battery_voltage);
        var level = json.Battery_voltage;
        var soc = parseInt(level);
        if (json.Battery_charge == 3 || json.Battery_charge == 2) {
          soc = 100;
        } else {
          soc = Math.ceil(level / 10) * 10;
        }
        //var level=json.Battery_voltage;
        if (soc <= 100 && soc >= 0) {
          $("#lDashBatteryQuantity").html(soc + "%");
        } else {
          $("#lDashBatteryQuantity").html("--");
        }
        if (json.connect_disconnect == "cellular") {
          $("#switchBtn_connStatus").addClass("switchBtn_check");
        } else {
          $("#switchBtn_connStatus").removeClass("switchBtn_check");
        }
        if (json.wlan_enable == "1") {
          $("#switchBtn_wifiStatus").addClass("switchBtn_check");
        } else {
          $("#switchBtn_wifiStatus").removeClass("switchBtn_check");
        }

        $("#lConnDeviceValue").html(
          parseInt(that.showNA(json.nr_connected_dev))
        );
        $("#txtRouterLanIP").html(that.showNA(json.lan_ip));
        var pinStatus = json.pin_status;
        var simStatus = json.sim_status;
        // var roaming=json.roaming;
        var sys_mode = json.sys_mode;
        var rssi = parseInt(json.rssi);
        var conn = json.connect_disconnect;

        if (simStatus != "0") {
          that.signalShow(0);
          $("#signalData").html(jQuery.i18n.prop("lSimCardAbsent_hone"));
        } else if (simStatus == "0") {
          if (pinStatus == "0") {
            //5 signal
            if (sys_mode == "3") {
              if (rssi < -110) that.signalShow(0);
              else if (rssi >= -110 && rssi <= -106) that.signalShow(1);
              else if (rssi >= 105 && rssi <= -100) that.signalShow(2);
              else if (rssi >= -99 && rssi <= -94) that.signalShow(3);
              else if (rssi >= -93 && rssi <= -88) that.signalShow(4);
              else if (rssi >= -87 && rssi <= -48) that.signalShow(5);
              $("#txtSystemNetworkMode").html("GSM");
              $("#signalData").text(rssi + " dBm");
            } else if (sys_mode == "5" || sys_mode == "15") {
              if (rssi >= -121 && rssi <= -105) that.signalShow(0);
              else if (rssi >= -104 && rssi <= -100) that.signalShow(1);
              else if (rssi >= -99 && rssi <= -95) that.signalShow(2);
              else if (rssi >= -94 && rssi <= -91) that.signalShow(3);
              else if (rssi >= -90 && rssi <= -86) that.signalShow(4);
              else if (rssi >= -85 && rssi <= -25) that.signalShow(5);
              $("#txtSystemNetworkMode").html("3G");
              $("#signalData").text(rssi + " dBm");
            } else if (sys_mode == "17") {
              if (rssi < -120) that.signalShow(0);
              else if (rssi >= -120 && rssi < -115) that.signalShow(1);
              else if (rssi >= -115 && rssi < -110) that.signalShow(2);
              else if (rssi >= -110 && rssi < -105) that.signalShow(3);
              else if (rssi >= -105 && rssi < -97) that.signalShow(4);
              else if (rssi >= -97 && rssi <= -44) that.signalShow(5);
              $("#txtSystemNetworkMode").html("4G");
              $("#signalData").text(rssi + " dBm");
            } else {
              that.signalShow(0);
              $("#signalData").text("");
              $("#txtSystemNetworkMode").html(
                jQuery.i18n.prop("lt_dashbd_NoService")
              );
            }
          } else if (pinStatus == "1") {
            that.signalShow(0);
            $("#signalData").text("PIN");
          } else if (pinStatus == "2") {
            that.signalShow(0);
            $("#signalData").text("PUK");
          } else if (pinStatus == "3") {
            that.signalShow(0);
            $("#signalData").text("lSIMLocked");
          } else if (pinStatus == "4") {
            that.signalShow(0);
            $("#signalData").text("lSIMerror");
          } else if (pinStatus == "48") {
            that.signalShow(0);
            $("#signalData").text("PNPIN");
          } else if (pinStatus == "49") {
            that.signalShow(0);
            $("#signalData").text("PNPUK");
          } else if (pinStatus == "50") {
            that.signalShow(0);
            $("#signalData").text("PUPIN");
          } else if (pinStatus == "51") {
            that.signalShow(0);
            $("#signalData").text("SPPIN");
          } else if (pinStatus == "52") {
            that.signalShow(0);
            $("#signalData").text("SPPIN");
          } else if (pinStatus == "53") {
            that.signalShow(0);
            $("#signalData").text("SPPUK");
          } else if (pinStatus == "54") {
            that.signalShow(0);
            $("#signalData").text("PCPIN");
          } else if (pinStatus == "55") {
            that.signalShow(0);
            $("#signalData").text("PCPUK");
          } else if (pinStatus == "56") {
            that.signalShow(0);
            $("#signalData").text("SIMPIN");
          } else if (pinStatus == "57") {
            that.signalShow(0);
            $("#signalData").text("SIMPUK");
          }
          if (conn != "cellular") {
            //that.signalShow(0);
            if (sys_mode == "3") {
              if (rssi < -110) that.signalShow(0);
              else if (rssi >= -110 && rssi <= -106) that.signalShow(1);
              else if (rssi >= 105 && rssi <= -100) that.signalShow(2);
              else if (rssi >= -99 && rssi <= -94) that.signalShow(3);
              else if (rssi >= -93 && rssi <= -88) that.signalShow(4);
              else if (rssi >= -87 && rssi <= -48) that.signalShow(5);
              $("#txtSystemNetworkMode").html("GSM");
              //$("#signalData").text(rssi + " dBm");
            } else if (sys_mode == "5" || sys_mode == "15") {
              if (rssi >= -121 && rssi <= -105) that.signalShow(0);
              else if (rssi >= -104 && rssi <= -100) that.signalShow(1);
              else if (rssi >= -99 && rssi <= -95) that.signalShow(2);
              else if (rssi >= -94 && rssi <= -91) that.signalShow(3);
              else if (rssi >= -90 && rssi <= -86) that.signalShow(4);
              else if (rssi >= -85 && rssi <= -25) that.signalShow(5);
              $("#txtSystemNetworkMode").html("3G");
              //$("#signalData").text(rssi + " dBm");
            } else if (sys_mode == "17") {
              if (rssi < -120) that.signalShow(0);
              else if (rssi >= -120 && rssi < -115) that.signalShow(1);
              else if (rssi >= -115 && rssi < -110) that.signalShow(2);
              else if (rssi >= -110 && rssi < -105) that.signalShow(3);
              else if (rssi >= -105 && rssi < -97) that.signalShow(4);
              else if (rssi >= -97 && rssi <= -44) that.signalShow(5);
              $("#txtSystemNetworkMode").html("4G");
              //$("#signalData").text(rssi + " dBm");
            } else {
              that.signalShow(0);
              //$("#signalData").text("");
              $("#txtSystemNetworkMode").html(
                jQuery.i18n.prop("lt_dashbd_NoService")
              );
            }
            $("#signalData").html(jQuery.i18n.prop("lt_Connection_failed"));
            $("#switchBtn_connStatus").removeClass("switchBtn_check");
            // $("#txtWifiSSID").html(json.ssid);
          } else {
            $("#switchBtn_connStatus").addClass("switchBtn_check");
          }
        }

        $("#txtRouterPhoneNum").html(that.showNA(json.MSISDN));
        $("#txtWifiSSID").html(that.showNA(UniDecode(json.ssid)));
        if (json.operator_name == "") {
          $("#txtNetworkOperator").html(
            jQuery.i18n.prop("lt_dashbd_NoService")
          );
        } else {
          $("#txtNetworkOperator").html(that.showNA(json.operator_name));
        }

        $("#txtRouterIMEI").html(that.showNA(json.imei));
        $("#txtSoftVersion").html(that.showNA(json.software_version));
        $("#txtRouterMAC").html(that.showNA(json.router_mac));
        $("#txtDashRouterRunTime").html(
          json.run_days +
            jQuery.i18n.prop("ldDays") +
            " " +
            json.run_hours +
            jQuery.i18n.prop("ldHours") +
            " " +
            json.run_minutes +
            jQuery.i18n.prop("ldMinutes") +
            " " +
            json.run_seconds +
            jQuery.i18n.prop("ldSeconds")
        );

        var f_rx_data = parseInt(json.data_sent);
        var f_tx_data = parseInt(json.data_received);
        $("#txtsentPackets").html(FormatDataTrafficMinUnitKB(f_rx_data));
        $("#txtRecPackets").html(FormatDataTrafficMinUnitKB(f_tx_data));

        var sendSpeed = parseInt(json.sent_speed);
        var receivedSpeed = parseInt(json.received_speed);
        $("#txtSendSpeed").html(FormatDataTrafficMinUnitKB(sendSpeed) + "/s");
        $("#txtReceivedSpeed").html(
          FormatDataTrafficMinUnitKB(receivedSpeed) + "/s"
        );
        sSpeedArr.push(sendSpeed);
        rSpeedArr.push(receivedSpeed);
        if (sSpeedArr.length > 8) sSpeedArr.shift();
        if (rSpeedArr.length > 8) rSpeedArr.shift();
        that.showCanvasSpeed();
      });
    };
    this.showCanvasSpeed = function () {
      var windowW = parseInt(document.body.offsetWidth);
      if (windowW < maxWindowW) {
        that.showPhoneCanvasSpeed();
      } else {
        var tCanvas = document.getElementById("trafficCanvas");
        var trafficCanvasW = 900;
        var trafficCanvasH = 400;
        tCanvas.width = trafficCanvasW;
        tCanvas.height = trafficCanvasH;
        var ctx_t = tCanvas.getContext("2d");

        ctx_t.clearRect(0, 0, trafficCanvasW, trafficCanvasH);
        ctx_t.beginPath();
        ctx_t.save();
        ctx_t.strokeStyle = "#777";
        ctx_t.moveTo(80, 50);
        ctx_t.lineTo(80, 350);
        ctx_t.lineTo(850, 350);
        ctx_t.stroke();

        ctx_t.strokeStyle = "#aaa";
        ctx_t.moveTo(80, 200);
        ctx_t.lineTo(850, 200);
        ctx_t.stroke();
        ctx_t.font = "15px Microsoft Yahei";
        ctx_t.fillStyle = "#777";
        var maxs = Math.max.apply(null, sSpeedArr);
        var maxr = Math.max.apply(null, rSpeedArr);
        var max;
        if (maxs > maxr) max = maxs;
        else max = maxr;

        // if(max!=0){
        //       ctx_t.fillText(FormatDataTrafficMinUnitKB(max)+"/s",10,100);
        // }
        // ctx_t.fillText("0.00KB/s",10,350);
        if (LANGUAGE == "en") {
          var en_s = jQuery.i18n.prop("lt_send_speed");
          var en_s_arr = en_s.split(" ");
          var en_r = jQuery.i18n.prop("lt_received_speed");
          var en_r_arr = en_r.split(" ");
          ctx_t.fillText(en_s_arr[1], 10, 340);
          ctx_t.fillText(en_s_arr[0], 10, 320);
          ctx_t.fillText(en_r_arr[1], 10, 190);
          ctx_t.fillText(en_r_arr[0], 10, 170);
        } else {
          var cn_s = jQuery.i18n.prop("lt_send_speed");
          var cn_s_arr = [cn_s.substring(2, cn_s.length), cn_s.substring(0, 2)];
          var cn_r = jQuery.i18n.prop("lt_received_speed");
          var cn_r_arr = [cn_r.substring(2, cn_r.length), cn_r.substring(0, 2)];
          ctx_t.fillText(cn_s_arr[0], 25, 345);
          ctx_t.fillText(cn_s_arr[1], 25, 325);
          ctx_t.fillText(cn_r_arr[0], 25, 195);
          ctx_t.fillText(cn_r_arr[1], 25, 175);
        }
        // ctx_t.fillText("0.00KB/s",10,200);
        ctx_t.restore();
        ctx_t.closePath();

        var sPointArr = [];
        var rPointArr = [];
        for (var i = 0; i < sSpeedArr.length; i++) {
          var x0, y0, value0, x1, y1, value1;
          x0 = 80 + i * 100;
          y0 = sSpeedArr[i] == 0 ? 350 : 350 - (sSpeedArr[i] / max) * 110;
          value0 = FormatDataTrafficMinUnitKB(sSpeedArr[i]) + "/s";
          if (FormatDataTrafficMinUnitKB(sSpeedArr[i]) == "0.00KB") {
            y0 = 350;
          }
          x1 = 80 + i * 100;
          y1 = rSpeedArr[i] == 0 ? 200 : 200 - (rSpeedArr[i] / max) * 110;
          value1 = FormatDataTrafficMinUnitKB(rSpeedArr[i]) + "/s";
          if (FormatDataTrafficMinUnitKB(rSpeedArr[i]) == "0.00KB") {
            y1 = 200;
          }
          sPointArr.push([x0, y0, value0, "up"]);
          rPointArr.push([x1, y1, value1, "up"]);
        }
        for (var j = 1; j < sPointArr.length; j++) {
          ctx_t.beginPath();
          ctx_t.save();
          ctx_t.strokeStyle = "#05bda1";
          ctx_t.fillStyle = "#05bda1";
          ctx_t.moveTo(sPointArr[j - 1][0], sPointArr[j - 1][1]);
          ctx_t.lineTo(sPointArr[j][0], sPointArr[j][1]);
          ctx_t.stroke();
          ctx_t.font = "15px Microsoft Yahei";
          ctx_t.fillText(
            sPointArr[j][2],
            sPointArr[j][0] - 25,
            sPointArr[j][1] - 15
          );
          ctx_t.restore();
          ctx_t.closePath();

          ctx_t.beginPath();
          ctx_t.save();
          ctx_t.strokeStyle = "#3bc316";
          ctx_t.fillStyle = "#3bc316";
          ctx_t.moveTo(rPointArr[j - 1][0], rPointArr[j - 1][1]);
          ctx_t.lineTo(rPointArr[j][0], rPointArr[j][1]);
          ctx_t.stroke();
          ctx_t.font = "15px Microsoft Yahei";
          ctx_t.fillText(
            rPointArr[j][2],
            rPointArr[j][0] - 25,
            rPointArr[j][1] - 15
          );
          ctx_t.restore();
          ctx_t.closePath();
        }
        for (var k = 0; k < sPointArr.length; k++) {
          ctx_t.beginPath();
          ctx_t.save();
          ctx_t.fillStyle = "#fff";
          ctx_t.strokeStyle = "#05bda1";
          ctx_t.arc(sPointArr[k][0], sPointArr[k][1], 5, 0, 2 * Math.PI, false);
          ctx_t.fill();
          ctx_t.stroke();
          ctx_t.restore();
          ctx_t.closePath();

          ctx_t.beginPath();
          ctx_t.save();
          ctx_t.fillStyle = "#fff";
          ctx_t.strokeStyle = "#3bc316";
          ctx_t.arc(rPointArr[k][0], rPointArr[k][1], 5, 0, 2 * Math.PI, false);
          ctx_t.fill();
          ctx_t.stroke();
          ctx_t.restore();
          ctx_t.closePath();
        }
      }
    };
    this.showPhoneCanvasSpeed = function () {
      var windowW = parseInt(document.body.offsetWidth);
      var tCanvas = document.getElementById("trafficCanvas");
      var trafficCanvasW = windowW;
      var trafficCanvasH = 450;
      tCanvas.width = trafficCanvasW;
      tCanvas.height = trafficCanvasH;
      var ctx_t = tCanvas.getContext("2d");

      ctx_t.clearRect(0, 0, trafficCanvasW, trafficCanvasH);
      ctx_t.beginPath();
      ctx_t.save();
      ctx_t.strokeStyle = "#777";
      ctx_t.moveTo(30, 100);
      ctx_t.lineTo(30, 400);
      ctx_t.lineTo(trafficCanvasW - 20, 400);
      ctx_t.stroke();

      ctx_t.strokeStyle = "#aaa";
      ctx_t.moveTo(30, 250);
      ctx_t.lineTo(trafficCanvasW - 20, 250);
      ctx_t.stroke();
      ctx_t.font = "15px Microsoft Yahei";
      ctx_t.fillStyle = "#777";
      var maxs = Math.max.apply(null, sSpeedArr);
      var maxr = Math.max.apply(null, rSpeedArr);
      var max;
      if (maxs > maxr) max = maxs;
      else max = maxr;

      // if(max!=0){
      //       ctx_t.fillText(FormatDataTrafficMinUnitKB(max)+"/s",10,100);
      // }
      // ctx_t.fillText("0.00KB/s",10,350);
      ctx_t.fillText("S", 10, 400);
      ctx_t.fillText("R", 10, 250);
      ctx_t.restore();
      ctx_t.closePath();

      var sPointArr = [];
      var rPointArr = [];
      var t = Math.floor((trafficCanvasW - 20) / 8);
      for (var i = 0; i < sSpeedArr.length; i++) {
        var x0, y0, value0, x1, y1, value1;
        x0 = 30 + i * t;
        y0 = sSpeedArr[i] == 0 ? 400 : 400 - (sSpeedArr[i] / max) * 105;
        value0 = FormatDataTrafficMinUnitKB(sSpeedArr[i]) + "/s";
        if (FormatDataTrafficMinUnitKB(sSpeedArr[i]) == "0.00KB") {
          y0 = 400;
        }
        x1 = 30 + i * t;
        y1 = rSpeedArr[i] == 0 ? 250 : 250 - (rSpeedArr[i] / max) * 105;
        value1 = FormatDataTrafficMinUnitKB(rSpeedArr[i]) + "/s";
        if (FormatDataTrafficMinUnitKB(rSpeedArr[i]) == "0.00KB") {
          y1 = 250;
        }
        if (i == 0) {
          sPointArr.push([x0, y0, value0, "up"]);
          rPointArr.push([x1, y1, value1, "up"]);
        }
        if (i != 0 && parseInt(sSpeedArr[i]) > parseInt(sSpeedArr[i - 1])) {
          sPointArr.push([x0, y0, value0, "up"]);
        } else {
          if (i != 0 && parseInt(sSpeedArr[i - 1]) == parseInt(sSpeedArr[i])) {
            if (i != 0 && sPointArr[i][3] == "up") {
              sPointArr.push([x0, y0, value0, "down"]);
            } else {
              sPointArr.push([x0, y0, value0, "up"]);
            }
          } else {
            sPointArr.push([x0, y0, value0, "down"]);
          }
        }
        if (i != 0 && parseInt(rSpeedArr[i]) > parseInt(rSpeedArr[i - 1])) {
          rPointArr.push([x1, y1, value1, "up"]);
        } else {
          if (i != 0 && parseInt(rSpeedArr[i - 1]) == parseInt(rSpeedArr[i])) {
            if (i != 0 && rPointArr[i][3] == "up") {
              rPointArr.push([x1, y1, value1, "down"]);
            } else {
              rPointArr.push([x1, y1, value1, "up"]);
            }
          } else {
            rPointArr.push([x1, y1, value1, "down"]);
          }
        }
      }
      for (var j = 1; j < sPointArr.length; j++) {
        ctx_t.beginPath();
        ctx_t.save();
        ctx_t.strokeStyle = "#05bda1";
        ctx_t.fillStyle = "#05bda1";
        ctx_t.moveTo(sPointArr[j - 1][0], sPointArr[j - 1][1]);
        ctx_t.lineTo(sPointArr[j][0], sPointArr[j][1]);
        ctx_t.stroke();
        ctx_t.font = "10px Microsoft Yahei";
        if (sPointArr[j][3] == "up") {
          ctx_t.fillText(
            sPointArr[j][2],
            sPointArr[j][0] - 25,
            sPointArr[j][1] - 12
          );
        } else {
          ctx_t.fillText(
            sPointArr[j][2],
            sPointArr[j][0] - 25,
            sPointArr[j][1] + 20
          );
        }

        ctx_t.restore();
        ctx_t.closePath();

        ctx_t.beginPath();
        ctx_t.save();
        ctx_t.strokeStyle = "#3bc316";
        ctx_t.fillStyle = "#3bc316";
        ctx_t.moveTo(rPointArr[j - 1][0], rPointArr[j - 1][1]);
        ctx_t.lineTo(rPointArr[j][0], rPointArr[j][1]);
        ctx_t.stroke();
        ctx_t.font = "10px Microsoft Yahei";
        if (rPointArr[j][3] == "up") {
          ctx_t.fillText(
            rPointArr[j][2],
            rPointArr[j][0] - 25,
            rPointArr[j][1] - 12
          );
        } else {
          ctx_t.fillText(
            rPointArr[j][2],
            rPointArr[j][0] - 25,
            rPointArr[j][1] + 20
          );
        }

        ctx_t.restore();
        ctx_t.closePath();
      }
      for (var k = 0; k < sPointArr.length; k++) {
        ctx_t.beginPath();
        ctx_t.save();
        ctx_t.fillStyle = "#fff";
        ctx_t.strokeStyle = "#05bda1";
        ctx_t.arc(sPointArr[k][0], sPointArr[k][1], 4, 0, 2 * Math.PI, false);
        ctx_t.fill();
        ctx_t.stroke();
        ctx_t.restore();
        ctx_t.closePath();

        ctx_t.beginPath();
        ctx_t.save();
        ctx_t.fillStyle = "#fff";
        ctx_t.strokeStyle = "#3bc316";
        ctx_t.arc(rPointArr[k][0], rPointArr[k][1], 4, 0, 2 * Math.PI, false);
        ctx_t.fill();
        ctx_t.stroke();
        ctx_t.restore();
        ctx_t.closePath();
      }
    };
    this.signalShow = function (num) {
      $("#signal1").removeClass("s_on");
      $("#signal2").removeClass("s_on");
      $("#signal3").removeClass("s_on");
      $("#signal4").removeClass("s_on");
      $("#signal5").removeClass("s_on");
      switch (num) {
        case 0:
          break;
        case 1:
          $("#signal1").addClass("s_on");
          break;
        case 2:
          $("#signal1").addClass("s_on");
          $("#signal2").addClass("s_on");
          break;
        case 3:
          $("#signal1").addClass("s_on");
          $("#signal2").addClass("s_on");
          $("#signal3").addClass("s_on");
          break;
        case 4:
          $("#signal1").addClass("s_on");
          $("#signal2").addClass("s_on");
          $("#signal3").addClass("s_on");
          $("#signal4").addClass("s_on");
          break;
        case 5:
          $("#signal1").addClass("s_on");
          $("#signal2").addClass("s_on");
          $("#signal3").addClass("s_on");
          $("#signal4").addClass("s_on");
          $("#signal5").addClass("s_on");
          break;
      }
    };
    this.displayControls = function () {
      document.getElementById("MainHelp").innerHTML =
        jQuery.i18n.prop("helpName");
      document.getElementById("MainLogOut").innerHTML =
        jQuery.i18n.prop("LogOutName");
      document.getElementById("quickSetupSpan").innerHTML =
        jQuery.i18n.prop("quickSetupName");

      document.getElementById("lt_dashbd_routerLanIp").innerHTML =
        jQuery.i18n.prop("lt_dashbd_routerLanIp");
      document.getElementById("lt_dashbd_IMEI").innerHTML =
        jQuery.i18n.prop("lt_dashbd_IMEI");
      document.getElementById("lt_dashbd_phoneNum").innerHTML =
        jQuery.i18n.prop("lt_dashbd_phoneNum");
      document.getElementById("lt_dashbd_RouterMAC").innerHTML =
        jQuery.i18n.prop("lt_dashbd_RouterMAC");
      document.getElementById("lt_dashbd_RouterRunTime").innerHTML =
        jQuery.i18n.prop("lt_dashbd_RouterRunTime");
      document.getElementById("lt_dashbd_BetteryInfo").innerHTML =
        jQuery.i18n.prop("lt_dashbd_BetteryInfo");
      document.getElementById("lt_dashbd_BetteryVol").innerHTML =
        jQuery.i18n.prop("lt_dashbd_BetteryVol");
      document.getElementById("lt_dashbd_SoftVersion").innerHTML =
        jQuery.i18n.prop("lt_dashbd_SoftVersion");

      document.getElementById("lt_dashbd_SignalStrength").innerHTML =
        jQuery.i18n.prop("lt_dashbd_SignalStrength");
      document.getElementById("lt_dashbd_connStatus").innerHTML =
        jQuery.i18n.prop("lt_dashbd_connStatus");
      document.getElementById("lt_dashbd_NetworkOperatorName").innerHTML =
        jQuery.i18n.prop("lt_dashbd_NetworkOperatorName");
      document.getElementById("lt_dashbd_CellularNetworkMode").innerHTML =
        jQuery.i18n.prop("lt_dashbd_CellularNetworkMode");
      document.getElementById("lt_dashbd_h3ConnDevice").innerHTML =
        jQuery.i18n.prop("lt_dashbd_h3ConnDevice");
      document.getElementById("lt_dashbd_wifiStatus").innerHTML =
        jQuery.i18n.prop("lt_dashbd_wifiStatus");
      document.getElementById("lt_dashbd_wifiSSID").innerHTML =
        jQuery.i18n.prop("lt_dashbd_wifiSSID");
      document.getElementById("lt_dashbd_SentPackets").innerHTML =
        jQuery.i18n.prop("lt_dashbd_SentPackets");
      document.getElementById("lt_dashbd_RecPackets").innerHTML =
        jQuery.i18n.prop("lt_dashbd_RecPackets");
      document.getElementById("lt_send_speed").innerHTML =
        jQuery.i18n.prop("lt_send_speed");
      document.getElementById("lt_received_speed").innerHTML =
        jQuery.i18n.prop("lt_received_speed");
      document.getElementById("lt_sms_readStatus").innerHTML =
        jQuery.i18n.prop("lt_sms_stcStatus");

      $("#lt_QsText").text(jQuery.i18n.prop("lt_QsText"));
      $("#lt_QsText1").text(jQuery.i18n.prop("lt_QsText1"));
      $("#lt_QsText2").text(jQuery.i18n.prop("lt_QsText2"));
      $("#lt_btnSkip").val(jQuery.i18n.prop("lt_btnSkip"));
      $("#lt_btnQuickSetup").val(jQuery.i18n.prop("lt_btnQuickSetup"));
      $("#lt_QsText3").text(jQuery.i18n.prop("lt_QsText3"));
      $("#lt_QsText4").text(jQuery.i18n.prop("lt_QsText4"));

      $("#lt_qs_h1UserSettings").text(jQuery.i18n.prop("lt_qs_h1UserSettings"));
      $("#lt_qs_h1InternetConnection").text(
        jQuery.i18n.prop("lt_qs_h1InternetConnection")
      );
      $("#lt_qs_h1WirelessSeetings").text(
        jQuery.i18n.prop("lt_qs_h1WirelessSeetings")
      );
      $("#lt_qs_h1DevicePlaceGuid").text(
        jQuery.i18n.prop("lt_qs_h1DevicePlaceGuid")
      );
      $("#lt_qs_h1UserSettings1").text(
        jQuery.i18n.prop("lt_qs_h1UserSettings")
      );
      $("#lt_qs_h1UserSettingsHeader").text(
        jQuery.i18n.prop("lt_qs_h1UserSettingsHeader")
      );
      $("#lt_qs_lPassword").text(jQuery.i18n.prop("lt_qs_lPassword"));
      $("#lt_qs_lRePassword").text(jQuery.i18n.prop("lt_qs_lRePassword"));
      $("#lt_qs_btnExit").text(jQuery.i18n.prop("lt_qs_btnExit"));
      $("#lt_qs_lInterConnQS").text(jQuery.i18n.prop("lt_qs_lInterConnQS"));
      $("#lt_qs_btnExit1").text(jQuery.i18n.prop("lt_qs_btnExit"));
      $("#lt_qs_btnExit2").text(jQuery.i18n.prop("lt_qs_btnExit"));
      $("#lt_qs_btnBack").val(jQuery.i18n.prop("lt_qs_btnBack"));
      $("#lt_qs_btnBack1").val(jQuery.i18n.prop("lt_qs_btnBack"));
      $("#lt_qs_btnBack2").val(jQuery.i18n.prop("lt_qs_btnBack"));
      $("#lt_qs_h1DevicePlaceGuid").text(
        jQuery.i18n.prop("lt_qs_h1DevicePlaceGuid")
      );
      $("#lt_qs_lDevicePlaceGuidText").text(
        jQuery.i18n.prop("lt_qs_lDevicePlaceGuidText")
      );
      $("#lt_qs_Microwave").text(jQuery.i18n.prop("lt_qs_Microwave"));
      $("#lt_qs_Bluetooth_Devices").text(
        jQuery.i18n.prop("lt_qs_Bluetooth_Devices")
      );
      $("#lt_qs_Cordless_Phone").text(jQuery.i18n.prop("lt_qs_Cordless_Phone"));
      $("#lt_qs_ownDevices").text(jQuery.i18n.prop("lt_qs_ownDevices"));
      $("#lt_qs_Baby_Monitor").text(jQuery.i18n.prop("lt_qs_Baby_Monitor"));
      $("#lableWelcome1").text(jQuery.i18n.prop("lableWelcome"));
      $("#MainHelp1").text(jQuery.i18n.prop("helpName"));
      $("#quickSetupspanlink").text(jQuery.i18n.prop("quickSetupspanlink"));
      $("#menuQuickSetup").text(jQuery.i18n.prop("quickSetupName"));
      $("#lt_qs_btnNext").val(jQuery.i18n.prop("lt_qs_btnNext"));
      $("#lt_qs_btnNext1").val(jQuery.i18n.prop("lt_qs_btnNext"));
      $("#lt_qs_btnNext2").val(jQuery.i18n.prop("lt_qs_btnNext"));
      $("#lt_qs_btnNext3").val(jQuery.i18n.prop("lt_qs_btnNext"));
      $("#lt_lacopyright1").text(jQuery.i18n.prop("lt_lacopyright"));
    };
    return this;
  };
})(jQuery);
function GetAuthType(encryptInfo) {
  var authType;
  switch (encryptInfo) {
    case "wpa2":
      authType = jQuery.i18n.prop("lt_wifiSet_WPA2");
      break;
    case "none":
      authType = jQuery.i18n.prop("lt_wifiSet_None");
      break;
    case "wpa":
      authType = jQuery.i18n.prop("lt_wifiSet_WPAWPA2");
      break;
    case "wep":
    case "wep-open":
      authType = jQuery.i18n.prop("lt_wifiSet_WEP");
      break;
    default:
      authType = "Unknow Error";
      break;
  }
  return authType;
}
function dashboardOnClick(obj) {
  var menuid = "";
  for (var i = 0; i < menu.Menu.length; i++) {
    if (menu.Menu[i].subMenu) {
      for (var j = 0; j < menu.Menu[i].subMenu.length; j++) {
        var l = menu.Menu[i].subMenu[j];
        if (l.id == obj && obj != "mDashboard") {
          menuid = menu.Menu[i].name;
          break;
        }
      }
    }
  }
  var subbox =
    '<div class="leftBar" id="leftBar"><div class="leftBar_bg" id="leftBar_bg"></div><ul class="leftMenu" id="submenu"></ul></div><div id="Content" class="content"></div><br class="clear" /><br class="clear" />';
  $("#mainColumn").html(subbox);
  var menuList =
    '<li style="width:134.5px;" ><a href="#" class="on" id="mDashboard" onclick="displaySubMenu(0)">' +
    jQuery.i18n.prop("mDashboard") +
    "</a></li>";
  for (var k = 1; k < menu.Menu.length; k++) {
    var m = menu.Menu[k];
    var MenuName = jQuery.i18n.prop(m.name);
    var lname = m.name;
    menuList +=
      '<li style="width:134.5px;" ><a href="#" id="' +
      lname +
      '" onclick="displaySubMenu(' +
      k +
      ')">' +
      MenuName +
      "</a></li>";
  }
  $("#menu").html(menuList);
  $("#menu li a").removeClass("on");
  $("#" + menuid).addClass("on");

  var subMenuList = "";
  for (var a = 0; a < menu.Menu.length; a++) {
    if (menu.Menu[a].name == menuid && menuid != "mDashboard") {
      for (var b = 0; b < menu.Menu[a].subMenu.length; b++) {
        var n = menu.Menu[a].subMenu[b];
        var subMenuName = jQuery.i18n.prop(n.id);
        subMenuList +=
          '<li class="" id="' +
          n.id +
          '" onclick="displaySubContent(\'' +
          n.id +
          '\')"><a href="#">' +
          subMenuName +
          "</a></li>";
      }
      break;
    }
  }
  clearInterval(dashboard_interval);
  $("#submenu").html(subMenuList);
  displaySubContent(obj);

  $("#media_menu").unbind("click");
  $("#media_menu").bind("click", function () {
    $("#leftBar").hide();
    if ($("#navigation").css("display") == "none") {
      $("#navigation").show();
    } else {
      $("#navigation").hide();
    }
  });
  $("#media_sub_menu").unbind("click");
  $("#media_sub_menu").bind("click", function () {
    $("#navigation").hide();
    if ($("#leftBar").css("display") == "none") {
      $("#leftBar").show();
    } else {
      $("#leftBar").hide();
    }
  });
  $("#leftBar_bg").css("width", parseInt(window.innerWidth) + "px");
  $("#leftBar_bg").unbind("click");
  $("#leftBar_bg").bind("click", function () {
    if ($("#leftBar").css("display") != "none") {
      $("#leftBar").hide();
    }
  });
}
// -------------------------------------------------------------objQuickSetup-----------------------------------------------------------------
(function ($) {
  $.objQuickSetup = function () {
    var that = this;
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        if (oneShowQuick == 0) {
          var jsonData = { dashboard: "get" };
          callJSON(jsonData, function (json) {
            if (json.dashboard.quick_set_flag == "0") {
              console.log(
                "-------------------" + json.dashboard.quick_set_flag
              );
              $("#mbox1").show();
              $("#btnSkipQsCheckBox").prop("checked", false);
              that.showHTMLData();
              that.bindQuickSetup();
              that.closeQuickSetup();
              oneShowQuick = 1;
              $("#mainColumn").show();
            } else {
              $("#mbox1").hide();
              $("#btnSkipQsCheckBox").prop("checked", true);
            }
          });
        } else if (oneShowQuick == 2) {
          $("#mbox1").hide();
          nowPage = "divQsUserNamePage";
          that.showPage();
          that.showHTMLData();
          that.bindQuickSetup();
          that.closeQuickSetup();
          $("#mainColumn").hide();
        } else {
          $("#mbox1").hide();
        }
      }
    };
    this.showHTMLData = function () {
      $("#userPageContent").html(
        CallHtmlFile("html/router/mAccountManage.html")
      );
      $.objAccountManage().onLoad(true);
      $(".help").hide();
      setDlgStyle();
    };
    this.bindQuickSetup = function () {
      $("#lt_btnQuickSetup").unbind("click");
      $("#lt_btnQuickSetup").bind("click", function () {
        $("#mbox1").hide();
        $("#mainColumn").hide();
        $("#quickSetup_box").show();
        quickNowPage = "divQsUserNamePage";
        that.showPage();
        if (MenuId == "mDashboard") {
          clearInterval(dashboard_interval);
        }
      });

      $("#btnSkipQsCheckBox").unbind("click");
      $("#btnSkipQsCheckBox").bind("click", function () {
        var jsonData;
        if ($("#btnSkipQsCheckBox").is(":checked")) {
          jsonData = { set_quick_set_flag: "1" };
          postJSON(jsonData, function (data) {});
        } else {
          jsonData = { set_quick_set_flag: "0" };
          postJSON(jsonData, function (data) {});
        }
      });
    };
    this.closeQuickSetup = function () {
      $("#lt_btnSkip").unbind("click");
      $("#lt_btnSkip").bind("click", function () {
        ExitQuickSetup();
      });
    };
    this.showPage = function () {
      $("#mainColumn").hide();
      $("#divQsUserNamePage").hide();
      $("#divQsInternetConnPage").hide();
      $("#divQsWifiSetPage").hide();
      $("#divQsDeviceGuidePage").hide();
      $("#lt_qs_h1UserSettings").removeClass("quick_on");
      $("#lt_qs_h1InternetConnection").removeClass("quick_on");
      $("#lt_qs_h1WirelessSeetings").removeClass("quick_on");
      $("#lt_qs_h1DevicePlaceGuid").removeClass("quick_on");
      $("#" + quickNowPage).show();
      switch (quickNowPage) {
        case "divQsUserNamePage":
          $("#lt_qs_h1UserSettings").addClass("quick_on");
          $("#userPageContent").html(
            CallHtmlFile("html/router/mAccountManage.html")
          );
          $.objAccountManage().onLoad(true);
          $(".help").hide();
          break;
        case "divQsInternetConnPage":
          $("#lt_qs_h1InternetConnection").addClass("quick_on");
          $("#InternetPageContent").html(
            CallHtmlFile("html/internet/mInternetConn.html")
          );
          $.objInternetConn().onLoad(true);
          $(".help").hide();
          break;
        case "divQsWifiSetPage":
          $("#lt_qs_h1WirelessSeetings").addClass("quick_on");
          $("#wifiPageContent").html(
            CallHtmlFile("html/wifi/mWifiInfoSet.html")
          );
          $.objWifiSet().onLoad(true);
          $(".help").hide();
          break;
        case "divQsDeviceGuidePage":
          $("#lt_qs_h1DevicePlaceGuid").addClass("quick_on");
          break;
      }
      setDlgStyle();
    };
    this.displayControls = function () {
      $("#lt_QsText").text(jQuery.i18n.prop("lt_QsText"));
      $("#lt_QsText1").text(jQuery.i18n.prop("lt_QsText1"));
      $("#lt_QsText2").text(jQuery.i18n.prop("lt_QsText2"));
      $("#lt_btnSkip").val(jQuery.i18n.prop("lt_btnSkip"));
      $("#lt_btnQuickSetup").val(jQuery.i18n.prop("lt_btnQuickSetup"));
      $("#lt_QsText3").text(jQuery.i18n.prop("lt_QsText3"));
      $("#lt_QsText4").text(jQuery.i18n.prop("lt_QsText4"));

      $("#lt_qs_h1UserSettings").text(jQuery.i18n.prop("lt_qs_h1UserSettings"));
      $("#lt_qs_h1InternetConnection").text(
        jQuery.i18n.prop("lt_qs_h1InternetConnection")
      );
      $("#lt_qs_h1WirelessSeetings").text(
        jQuery.i18n.prop("lt_qs_h1WirelessSeetings")
      );
      $("#lt_qs_h1DevicePlaceGuid").text(
        jQuery.i18n.prop("lt_qs_h1DevicePlaceGuid")
      );
      $("#lt_qs_h1UserSettings1").text(
        jQuery.i18n.prop("lt_qs_h1UserSettings")
      );
      $("#lt_qs_h1UserSettingsHeader").text(
        jQuery.i18n.prop("lt_qs_h1UserSettingsHeader")
      );
      $("#lt_qs_lPassword").text(jQuery.i18n.prop("lt_qs_lPassword"));
      $("#lt_qs_lRePassword").text(jQuery.i18n.prop("lt_qs_lRePassword"));
      $("#lt_qs_btnExit").text(jQuery.i18n.prop("lt_qs_btnExit"));
      $("#lt_qs_lInterConnQS").text(jQuery.i18n.prop("lt_qs_lInterConnQS"));
      $("#lt_qs_btnExit1").text(jQuery.i18n.prop("lt_qs_btnExit"));
      $("#lt_qs_btnExit2").text(jQuery.i18n.prop("lt_qs_btnExit"));
      $("#lt_qs_btnBack").val(jQuery.i18n.prop("lt_qs_btnBack"));
      $("#lt_qs_btnBack1").val(jQuery.i18n.prop("lt_qs_btnBack"));
      $("#lt_qs_btnBack2").val(jQuery.i18n.prop("lt_qs_btnBack"));
      $("#lt_qs_h1DevicePlaceGuid").text(
        jQuery.i18n.prop("lt_qs_h1DevicePlaceGuid")
      );
      $("#lt_qs_lDevicePlaceGuidText").text(
        jQuery.i18n.prop("lt_qs_lDevicePlaceGuidText")
      );
      $("#lt_qs_Microwave").text(jQuery.i18n.prop("lt_qs_Microwave"));
      $("#lt_qs_Bluetooth_Devices").text(
        jQuery.i18n.prop("lt_qs_Bluetooth_Devices")
      );
      $("#lt_qs_Cordless_Phone").text(jQuery.i18n.prop("lt_qs_Cordless_Phone"));
      $("#lt_qs_ownDevices").text(jQuery.i18n.prop("lt_qs_ownDevices"));
      $("#lt_qs_Baby_Monitor").text(jQuery.i18n.prop("lt_qs_Baby_Monitor"));
      $("#lableWelcome1").text(jQuery.i18n.prop("lableWelcome"));
      $("#MainHelp1").text(jQuery.i18n.prop("helpName"));
      $("#quickSetupspanlink").text(jQuery.i18n.prop("quickSetupspanlink"));
      $("#menuQuickSetup").text(jQuery.i18n.prop("quickSetupName"));
      $("#lt_qs_btnNext").val(jQuery.i18n.prop("lt_qs_btnNext"));
      $("#lt_qs_btnNext1").val(jQuery.i18n.prop("lt_qs_btnNext"));
      $("#lt_qs_btnNext2").val(jQuery.i18n.prop("lt_qs_btnNext"));
      $("#lt_qs_btnNext3").val(jQuery.i18n.prop("lt_qs_btnNext"));
      $("#lt_lacopyright1").text(jQuery.i18n.prop("lt_lacopyright"));
    };
    return this;
  };
})(jQuery);

function ExitQuickSetup() {
  quickNowPage = "divQsUserNamePage";
  $.objQuickSetup().showPage();
  $("#quickSetup_box").hide();
  $("#mainColumn").show();
  $("#mbox1").hide();
  if (MenuId == "mDashboard") {
    clearInterval(dashboard_interval);
    dashboard_interval = setInterval(function () {
      $.objDashboard().onLoad(false);
    }, 5000);
  } else if (MenuId == "tWireless") {
    $.objWifiSet().onLoad(false);
  } else if (MenuId == "tInternet") {
    $.objInternetConn().onLoad(false);
  }
  setDlgStyle();
  $("#userPageContent").html("");
  $("#InternetPageContent").html("");
  $("#wifiPageContent").html("");
}

function showDiv(page) {
  quickNowPage = page;
  $.objQuickSetup().showPage();
  setDlgStyle();
}

// -------------------------------------------------------------objInternetConn-----------------------------------------------------------------
(function ($) {
  $.objInternetConn = function () {
    var that = this;
    var mtu_value;
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.dialSet();
        that.btnEvent();
        that.networkSelection();
      }
      that.showData();
      setDlgStyle();
    };
    this.showData = function () {
      callJSON("wan_dialup", function (json) {
        if (json.connect_mode == "1") {
          $("#radio_manual").prop("checked", true);
        } else {
          $("#radio_auto").prop("checked", true);
        }

        if (json.Roaming_disable_auto_dial == "1") {
          $("#check_roaming").prop("checked", false);
        } else {
          $("#check_roaming").prop("checked", true);
        }
      });
      callJSON("wan_network", function (json) {
        var network_mode = json.NW_mode;
        var preferred_mode = json.prefer_mode;
        var prefer_lte_type = json.prefer_lte_type;

        if ("2" == network_mode || "1" == network_mode || "3" == network_mode) {
          // only 4G
          document.getElementById("network_selectModeType").value =
            network_mode;
          document.getElementById("network_lteType").value = prefer_lte_type;
          $("#lteNetworkType").show();
        } else if (
          "5" == network_mode ||
          "6" == network_mode ||
          "4" == network_mode
        ) {
          // only 3G
          document.getElementById("network_selectModeType").value =
            network_mode;
          $("#lteNetworkType").hide();
        } else {
          document.getElementById("network_selectModeType").value =
            network_mode;
          document.getElementById("network_lteType").value = prefer_lte_type;
        }
        $("#mtu_input").val(json.mtu);
        mtu_value = json.mtu;
      });
      callJSON("status1", function (json) {
        var conn = json.connect_disconnect;
        if (conn == "cellular") {
          $("#sel_connect").val("cellular");
        } else {
          $("#sel_connect").val("disabled");
        }
      });
    };
    this.dialSet = function () {
      $("#btn_dialSet").unbind("click");
      $("#btn_dialSet").bind("click", function () {
        var auto_manual, data_roaming;
        auto_manual = $("#radio_manual").is(":checked") ? "1" : "0";
        data_roaming = $("#check_roaming").is(":checked") ? "0" : "1";
        var jsonData = {};
        jsonData.connect_mode = auto_manual;
        jsonData.Roaming_disable_auto_dial = data_roaming;
        jsonData.Roaming_disable_auto_dial_action = "1";
        showWait();
        setTimeout(function () {
          postJSON("wan_dialup", jsonData, function (data) {
            that.onLoad(false);
          });
        }, 100);
      });
    };
    this.btnEvent = function () {
      $("#mtu_input").unbind("input");
      $("#mtu_input").bind("input", function () {
        that.checkMtu();
      });

      $("#network_selectModeType").unbind("change");
      $("#network_selectModeType").bind("change", function () {
        var value = $("#network_selectModeType").val();
        if ("2" == value || "3" == value || "1" == value) {
          //only 4G
          $("#lteNetworkType").show();
        } else if ("5" == value || "6" == value || "4" == value) {
          // only 3G
          $("#lteNetworkType").hide();
        }
      });

      $("#sel_connect").unbind("change");
      $("#sel_connect").bind("change", function () {
        showWait();
        setTimeout(function () {
          var conn = $("#sel_connect").val();
          var jsonData = {};
          jsonData.connect_disconnect = conn;
          postJSON("status1", jsonData, function (data) {
            that.onLoad(false);
          });
        }, 100);
      });
    };
    this.checkMtu = function () {
      $("#error_mtu").hide();
      var mtu = parseInt($("#mtu_input").val());
      if (mtu >= 1000 && mtu <= 1500) {
        return true;
      } else {
        $("#error_mtu").show();
        $("#error_mtu").html(jQuery.i18n.prop("lMtuInvalidTip"));
        return false;
      }
    };
    this.networkSelection = function () {
      $("#btn_network_mode_apply").unbind("click");
      $("#btn_network_mode_apply").bind("click", function () {
        if (that.checkMtu()) {
          var mtu = $("#mtu_input").val();
          var selectModeType = $("#network_selectModeType").val();
          var preferred = $("#network_lteType").val();

          var jsonData = {};
          jsonData.NW_mode = selectModeType;
          jsonData.NW_mode_action = "1";
          jsonData.prefer_lte_type = preferred;
          if (selectModeType == "5") {
            jsonData.prefer_lte_type_action = "0";
          } else {
            jsonData.prefer_lte_type_action = "1";
          }
          if (selectModeType == "1") {
            jsonData.prefer_mode = "1";
            jsonData.prefer_mode_action = "1";
          } else if (selectModeType == "3") {
            jsonData.prefer_mode = "3";
            jsonData.prefer_mode_action = "1";
          } else if (selectModeType == "4") {
            jsonData.prefer_mode = "5";
            jsonData.prefer_mode_action = "1";
          }
          if (mtu_value != mtu) {
            jsonData.mtu = mtu;
            jsonData.mtu_action = "1";
          }
          showWait();
          setTimeout(function () {
            postJSON("wan_network", jsonData, function () {
              that.onLoad(false);
            });
          }, 100);
        }
      });
    };
    this.displayControls = function () {
      $("#lt_internetConn_title").html(jQuery.i18n.prop("lt_dial_set_title"));
      $("#lt_NetworkSelection_title").html(
        jQuery.i18n.prop("lt_NetworkSelection_title")
      );
      $("#lt_wan_conn_mode").html(jQuery.i18n.prop("lt_wan_conn_mode"));
      $("#span_connMode_auto").html(jQuery.i18n.prop("AutoSelectNWMode"));
      $("#span_connMode_manual").html(jQuery.i18n.prop("ManualSelectNWMode"));
      $("#span_data_roaming").html(jQuery.i18n.prop("span_data_roaming"));
      $("#btn_dialSet").val(jQuery.i18n.prop("lt_btnApply"));
      $("#lt_networkMode").html(jQuery.i18n.prop("lt_interCon_NetworkMode"));
      $("#type_4g3g2g").html(jQuery.i18n.prop("lt_interCon_dropdownMultimode"));
      $("#type_4g_only").html(jQuery.i18n.prop("lt_interCon_dropdown4Gonly"));
      $("#type_4g3g").html(jQuery.i18n.prop("lt_interCon_dropdown43Gonly"));
      $("#type_3g_only").html(jQuery.i18n.prop("lt_interCon_dropdown3Gonly"));
      $("#type_3g2g").html(jQuery.i18n.prop("lt_interCon_dropdown32Gonly"));
      $("#type_2g_only").html(jQuery.i18n.prop("lt_interCon_dropdown2Gonly"));
      $("#lt_Preferred").html(
        jQuery.i18n.prop("lt_interCon_preferredNetworkMode")
      );
      $("#dropdownTDPre").html(jQuery.i18n.prop("lt_interCon_dropdownTDPre"));
      $("#dropdownFDDPre").html(jQuery.i18n.prop("lt_interCon_dropdownFDDPre"));
      $("#lt_mtu").html(jQuery.i18n.prop("lt_mtu"));
      $("#btn_network_mode_apply").val(jQuery.i18n.prop("lt_btnApply"));
      $("#lt_connect").html(jQuery.i18n.prop("lt_interCon_internetConnMode"));
      $("#op_connect").html(jQuery.i18n.prop("lt_interCon_cellularMode"));
      $("#op_disconnect").html(jQuery.i18n.prop("lt_interCon_disabledMode"));
    };
    return this;
  };
})(jQuery);
// -------------------------------------------------------------objManualNetwork-----------------------------------------------------------------
var smiCardExist = false;
var bIsScanNetwork = false;
var searchNetworkStartTime = 0;
var SelectNetworkValue;
(function ($) {
  $.objManualNetwork = function () {
    var that = this;
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.btnEvent();
      }
      that.showData();
      setDlgStyle();
    };
    this.showData = function () {
      callJSON("status1", function (json) {
        if (json.sim_status == 0 || json.sim_status == "0") {
          smiCardExist = true;
        }
      });
      callJSON("wan_manual_network", function (json) {
        var selectNWMode;
        var manual_network_check;
        var auto_network;
        var network_param_default;
        manual_network_check = json.manual_network_start;
        network_param_default = json.network_param;
        SelectNetworkValue = network_param_default;
        auto_network = json.auto_network;
        selectNWMode = json.select_NW_Mode;

        if (json.mannual_network_list.length > 0 && bIsScanNetwork) {
          bIsScanNetwork = false;
          that.loadManualNetwork(json);
          showMsgBox(
            jQuery.i18n.prop("mManualNetwork"),
            jQuery.i18n.prop("completeScanNetwork")
          );
          $("#btUpdate1").attr("disabled", false);
          $("#btUpdate1").removeClass("disBtn");
        } else if (json.mannual_network_list.length > 0 && !bIsScanNetwork) {
          that.loadManualNetwork(json);
          $("#btUpdate1").attr("disabled", false);
          $("#btUpdate1").removeClass("disBtn");
          var param = json.network_param.split("%");
          var val = param[0] + "%" + param[1] + "%" + param[2];
          $("#Networkdropdown").val(val);
        }
      });
    };
    this.loadManualNetwork = function (json) {
      $("#Networkdropdown").html("");
      var network_param_value = "";
      var name_act_web = "";
      network_param_value = json.network_param;

      name_act_web = "Auto";
      name_act_plmn = "30";
      var opt_auto = document.createElement("option");
      opt_auto.id = "dropdownAuto";
      opt_auto.text = name_act_web;
      opt_auto.value = name_act_plmn;
      document.getElementById("Networkdropdown").options.add(opt_auto);

      if (json.mannual_network_list.length > 0) {
        for (var i = 0; i < json.mannual_network_list.length; i++) {
          var l = json.mannual_network_list[i];
          var network_plmn = l.plmm_name;
          var network_act = l.act;
          var network_name = l.name;
          if (network_plmn == "51088" || network_plmn == "51068") {
            name_act_web =
              "BOLT SUPER" + " " + that.networkAct2Mode(network_act);
          } else {
            name_act_web =
              network_name + " " + that.networkAct2Mode(network_act);
          }
          name_act_plmn = network_name + "%" + network_act + "%" + network_plmn;
          var opt = document.createElement("option");
          opt.text = name_act_web + " " + network_plmn;
          opt.value = name_act_plmn;
          document.getElementById("Networkdropdown").options.add(opt);
        }
      }

      if (network_param_value.length == 0 || network_param_value == "30") {
        $("#Networkdropdown").val("30");
      } else {
        $("#Networkdropdown").val(network_param_value);
      }
    };
    this.networkAct2Mode = function (networkAct) {
      var act_netmode = "";
      switch (networkAct) {
        case "0":
          act_netmode = "2G";
          break;
        case "1":
          act_netmode = "2G C";
          break;
        case "2":
          act_netmode = "3G";
          break;
        case "3":
          act_netmode = "2G(EDGE)";
          break;
        case "4":
          act_netmode = "3G(HSDPA)";
          break;
        case "5":
          act_netmode = "3G(HSUPA)";
          break;
        case "6":
          act_netmode = "3G(HSDPA+HSUPA)";
          break;
        case "7":
          act_netmode = "4G(LTE)";
          break;
        default:
          break;
      }
      return act_netmode;
    };
    this.btnEvent = function () {
      $("#btUpdate1").unbind("click");
      $("#btUpdate1").bind("click", function () {
        callJSON("status1", function (json) {
          if (json.sim_status == "1") {
            showMsgBox(
              jQuery.i18n.prop("lt_lWarning"),
              jQuery.i18n.prop("lSimCardAbsent")
            );
            return;
          }
          if (json.pin_status == "1") {
            showMsgBox(
              jQuery.i18n.prop("lt_lWarning"),
              jQuery.i18n.prop("lPinEnable")
            );
            return;
          }
          if (json.pin_status == "2") {
            showMsgBox(
              jQuery.i18n.prop("lt_lWarning"),
              jQuery.i18n.prop("lPukEnable")
            );
            return;
          }

          var ManualNetworkHTML =
            "<p>" +
            jQuery.i18n.prop("lt_ManualNet_lManualPromte") +
            '</p><br/><div style="text-align:center;"><input type="button" onclick="btnManualScanConfirm()" value="' +
            jQuery.i18n.prop("lt_btnOK") +
            '" class="btn-apply"/><input type="button" onclick="CloseDlg()" value="' +
            jQuery.i18n.prop("lt_btnCancel") +
            '" class="btn-apply" style="margin-left:20px;" /></div>';
          showMsgBox(
            jQuery.i18n.prop("lt_ManualNet_SearchNetwork"),
            ManualNetworkHTML
          );
        });
      });

      $("#btUpdate").unbind("click");
      $("#btUpdate").bind("click", function () {
        var network_parm = $("#Networkdropdown").val();
        var jsonData = {};
        jsonData.bgscan_time = "4";
        jsonData.bgscan_time_action = "1";
        jsonData.network_param = network_parm;
        if (SelectNetworkValue != network_parm) {
          jsonData.network_param_action = "1";
        } else {
          jsonData.network_param_action = "0";
        }
        jsonData.network_select_done = "0";
        jsonData.manual_network_start = "0";
        showWait();
        setTimeout(function () {
          postJSON("wan_manual_network", jsonData, function (data) {});
        }, 100);
      });
    };
    this.displayControls = function () {
      $("#title").html(jQuery.i18n.prop("mManualNetwork"));
      $("#lt_ManualNet_SearchNetwork").html(
        jQuery.i18n.prop("lt_ManualNet_SearchNetwork")
      );
      $("#btUpdate1").val(jQuery.i18n.prop("lt_ManualNet_btnSearchNetwork"));
      $("#lMannualNetwork").html(
        jQuery.i18n.prop("lt_ManualNet_lMannualNetwork")
      );
      $("#dropdownAuto").html(jQuery.i18n.prop("lt_ManualNet_auto"));
      $("#lManualNetworkStart").html(jQuery.i18n.prop("lManualNetworkStart"));
      $("#dispmanualnetworktext").html(
        jQuery.i18n.prop("dispmanualnetworktext")
      );
      $("#lBgScanTime").html(jQuery.i18n.prop("lt_ManualNet_BgScanTime"));
      $("#dropdownImmediate").html(
        jQuery.i18n.prop("lt_ManualNet_bgScan_immediately")
      );
      $("#dropdown30sec").html(jQuery.i18n.prop("lt_ManualNet_bgScan_30sec"));
      $("#dropdown1M").html(jQuery.i18n.prop("lt_ManualNet_bgScan_1min"));
      $("#dropdown3M").html(jQuery.i18n.prop("lt_ManualNet_bgScan_3min"));
      $("#dropdown5M").html(jQuery.i18n.prop("lt_ManualNet_bgScan_5min"));
      $("#dropdown10M").html(jQuery.i18n.prop("lt_ManualNet_bgScan_10min"));
      $("#dropdown15M").html(jQuery.i18n.prop("lt_ManualNet_bgScan_15min"));
      $("#dropdown30M").html(jQuery.i18n.prop("lt_ManualNet_bgScan_30min"));
      $("#dropdown60M").html(jQuery.i18n.prop("lt_ManualNet_bgScan_60min"));
      $("#dropdownLteTimeDisable").html(
        jQuery.i18n.prop("lt_ManualNet_bgScan_Disable")
      );
      $("#CurrentScanModeLabel").html(jQuery.i18n.prop("CurrentScanModeLabel"));
      $("#btUpdate").val(jQuery.i18n.prop("lt_btnSave"));
    };
    return this;
  };
})(jQuery);
function btnManualScanConfirm() {
  if (!bIsScanNetwork) {
    $("#btUpdate1").attr("disabled", true);
    $("#btUpdate1").addClass("disBtn");
    manualSearchNetwork();
  }
}
function manualSearchNetwork() {
  ManualNetworkSelect = 1;
  bIsScanNetwork = true;
  searchNetworkStartTime = new Date().getTime();
  var jsonData = {};
  jsonData.search_network = "1";
  jsonData.network_select_done = "0";
  showWait();
  CloseDlg();
  setTimeout(function () {
    postJSON("wan_manual_network", jsonData, function (json) {
      showWait();
      QueryScanResult();
    });
  }, 100);
}
function QueryScanResult() {
  callJSON("wan_manual_network", function (wan_manual_json) {
    var currentTime = new Date().getTime();

    if (currentTime - searchNetworkStartTime > 120000) {
      closeWait();
      showMsgBox(
        jQuery.i18n.prop("mManualNetwork"),
        jQuery.i18n.prop("lScanNetworkTimeOut")
      );
      bIsScanNetwork = false;
      $("#div_scanning_network").hide();

      $("#btn_manual_scan_network").removeAttr("disabled");
      return;
    } else {
      if (null === wan_manual_json || wan_manual_json === undefined) {
        setTimeout(QueryScanResult, 5000);
      } else {
        if (wan_manual_json.mannual_network_list.length > 0) {
          if (!bIsScanNetwork) {
            return;
          }
          closeWait();
          showMsgBox(
            jQuery.i18n.prop("mManualNetwork"),
            jQuery.i18n.prop("completeScanNetwork")
          );
          // bIsScanNetwork = false;

          $("#btUpdate1").attr("disabled", false);
          $("#btUpdate1").removeClass("disBtn");
          $.objManualNetwork().onLoad(false);
        } else {
          setTimeout(QueryScanResult, 5000);
        }
      }
    }
  });
}
// -------------------------------------------------------------objPinPuk-----------------------------------------------------------------
(function ($) {
  $.objPinPuk = function () {
    var that = this;
    var gPinStatus = "";
    var gPinRetryCnt = "";
    var gPukRetryCnt = "";
    var gPinInUse = "";
    var pin_attempts_gl;
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.btnShowBox();
        that.EnablePinCode();
        that.DisablePinCode();
        that.ChangePinCode();
        that.EnterPinCode();
        that.EnterPukCode();
      }
      that.clearTextBox();
      that.showData();
      setDlgStyle();
    };
    this.showData = function () {
      showWait();
      setTimeout(function () {
        callJSON("pin_puk", function (json) {
          closeWait();
          if (json.sim_status != "0") {
            $("#txtPinInfo").hide();
            showMsgBox(
              jQuery.i18n.prop("mPinPuk"),
              jQuery.i18n.prop("lUnknownNoSIM")
            );
            return;
          }
          var mep_currentststus = json.mep_current_status;
          gPinStatus = mep_currentststus;
          if (
            mep_currentststus != "PIN_LOCK" &&
            mep_currentststus != "PUK_LOCK" &&
            mep_currentststus != "READY"
          ) {
            showMsgBox(
              jQuery.i18n.prop("mPinPuk"),
              jQuery.i18n.prop("lMEPUnlockrequired")
            );
            return;
          }
          gPinRetryCnt = json.pin_attempts;
          pin_attempts_gl = gPinRetryCnt;
          gPukRetryCnt = json.puk_attempts;
          gPinInUse = json.pin_enabled;

          if (gPinRetryCnt == "-1" || gPukRetryCnt == "-1") {
            $("#txtPinInfo").hide();
            showMsgBox(
              jQuery.i18n.prop("mPinPuk"),
              jQuery.i18n.prop("lUnknownNoSIM")
            );
            return;
          } else if (gPinRetryCnt == "0" && gPukRetryCnt == "0") {
            $("#txtPinInfo").hide();
            showMsgBox(
              jQuery.i18n.prop("mPinPuk"),
              jQuery.i18n.prop("lPukExhausted")
            );
            return;
          }

          var pinInfo = "";
          if (gPinInUse == "0") {
            if (gPinRetryCnt == "0") {
              // that.onLoad(false);
            }
            pinInfo = pinInfo + jQuery.i18n.prop("lt_pin_notinuse") + "<br>";
          } else {
            pinInfo = pinInfo + jQuery.i18n.prop("lt_pin_inuse") + "<br>";
            pinInfo =
              pinInfo +
              jQuery.i18n.prop("lt_pin_status") +
              " " +
              jQuery.i18n.prop("lt_pin_" + gPinStatus) +
              "<br>";
          }
          pinInfo =
            pinInfo + jQuery.i18n.prop("lpinattempts") + gPinRetryCnt + "<br>";
          pinInfo = pinInfo + jQuery.i18n.prop("lpukattempts") + gPukRetryCnt;
          $("#txtPinInfo").html(pinInfo);
          $("#txtPinInfo").show();
          that.disablePinPukButtons();
        });
      }, 100);
    };
    this.clearTextBox = function () {
      $("#txtEnablePin").val("");
      $("#txtDisablePin").val("");
      $("#txtPuk").val("");
      $("#txtchangePin1").val("");
      $("#txtchangePin2").val("");
      $("#txtEnterPin").val("");
      $("#txtEnterPuk").val("");
      $("#txtEnterPukPin1").val("");
      $("#txtEnterPukPin2").val("");
    };
    this.disablePinPukButtons = function () {
      $("#spanEnablePin").hide();
      $("#spanDisablePin").hide();
      $("#spanChangePinCode").hide();
      $("#spanEnterPukCode").hide();
      $("#spanEnterPinCode").hide();
      $("#divEnablePin").hide();
      $("#divDisablePin").hide();
      $("#divChangePin").hide();
      $("#divEnterPuk").hide();
      $("#divEnterPin").hide();

      // PIN is not in use
      if (gPinInUse == "0" && gPinStatus == "READY") {
        $("#spanEnablePin").show();
        return;
      }
      // Disable buttons according to PIN status
      if (gPinStatus == "READY") {
        $("#spanDisablePin").show();
        $("#spanChangePinCode").show();
      } else if (gPinStatus == "PIN_LOCK") {
        // PIN Required
        if (gPinRetryCnt == "0") {
          $("#spanEnterPukCode").show();
        } else {
          $("#spanEnterPinCode").show();
        }
      } else if (gPinStatus == "PUK_LOCK") {
        // PUK Required
        if (gPinRetryCnt == "0") {
          $("#spanEnterPukCode").show();
        } else {
          $("#spanEnterPinCode").show();
        }
      }
    };
    this.refreshPinInfo = function () {
      callJSON("pin_puk", function (json) {
        gPinRetryCnt = json.pin_attempts;
        gPukRetryCnt = json.puk_attempts;
        gPinInUse = json.pin_enabled;
        var pinInfo = "";
        if (gPinInUse == "0") {
          if (gPinRetryCnt == "0") {
            that.onLoad(false);
          }
          pinInfo = pinInfo + jQuery.i18n.prop("lt_pin_notinuse") + "<br>";
        } else {
          pinInfo = pinInfo + jQuery.i18n.prop("lt_pin_inuse") + "<br>";
          pinInfo =
            pinInfo + jQuery.i18n.prop("lt_pin_status") + gPinStatus + "<br>";
          if (gPinRetryCnt == "0" && gPukRetryCnt != "0") {
            that.disablePinPukButtons();
            $("#spanEnterPukCode").click();
          }
        }
        pinInfo =
          pinInfo + jQuery.i18n.prop("lpinattempts") + gPinRetryCnt + "<br>";
        pinInfo = pinInfo + jQuery.i18n.prop("lpukattempts") + gPukRetryCnt;
        $("#txtPinInfo").html(pinInfo);
      });
    };
    this.btnShowBox = function () {
      $("#spanEnablePin").unbind("click");
      $("#spanEnablePin").bind("click", function () {
        if ($("#divEnablePin").css("display") == "none") {
          $("#divEnablePin").show();
        } else {
          $("#divEnablePin").hide();
        }
        that.clearText("lt_enabledPin_error");
      });
      $("#spanDisablePin").unbind("click");
      $("#spanDisablePin").bind("click", function () {
        if ($("#divDisablePin").css("display") == "none") {
          $("#divDisablePin").show();
        } else {
          $("#divDisablePin").hide();
        }
        that.clearText("lt_disablePin_error");
      });
      $("#spanChangePinCode").unbind("click");
      $("#spanChangePinCode").bind("click", function () {
        if ($("#divChangePin").css("display") == "none") {
          $("#divChangePin").show();
        } else {
          $("#divChangePin").hide();
        }
        that.clearText("lt_changePin_error");
      });
      $("#spanEnterPukCode").unbind("click");
      $("#spanEnterPukCode").bind("click", function () {
        if ($("#divEnterPuk").css("display") == "none") {
          $("#divEnterPuk").show();
        } else {
          $("#divEnterPuk").hide();
        }
        that.clearText("lt_enterPuk_error");
      });
      $("#spanEnterPinCode").unbind("click");
      $("#spanEnterPinCode").bind("click", function () {
        if ($("#divEnterPin").css("display") == "none") {
          $("#divEnterPin").show();
        } else {
          $("#divEnterPin").hide();
        }
        that.clearText("lt_enterPin_error");
      });
    };
    this.clearText = function (objError) {
      $("#Content input[type='password']").val("");
      $("#" + objError).hide();
    };
    this.checkPin = function (pinpukVal, objError) {
      $("#" + objError).hide();
      if (
        pinpukVal.length < 4 ||
        pinpukVal.length > 8 ||
        !IsNumber(pinpukVal)
      ) {
        $("#" + objError).html(jQuery.i18n.prop("linvalidPin"));
        $("#" + objError).show();
        return false;
      }
      return true;
    };
    this.checkPuk = function (pinpukVal, objError) {
      $("#" + objError).hide();
      if (pinpukVal.length != 8 || !IsNumber_1(pinpukVal)) {
        $("#" + objError).html(jQuery.i18n.prop("linvalidPuk"));
        $("#" + objError).show();
        return false;
      }
      return true;
    };
    this.checkChange = function (pin, pin1, pin2, objError) {
      if (
        that.checkPin(pin, objError) &&
        that.checkPin(pin1, objError) &&
        that.checkPin(pin2, objError)
      ) {
        if (pin1 == pin2) {
          return true;
        } else {
          $("#" + objError).html(jQuery.i18n.prop("linvalidNewPin"));
          $("#" + objError).show();
          return false;
        }
      }
      return false;
    };
    this.checkChange_puk = function (puk, pin1, pin2, objError) {
      if (
        that.checkPuk(puk, objError) &&
        that.checkPin(pin1, objError) &&
        that.checkPin(pin2, objError)
      ) {
        if (pin1 == pin2) {
          return true;
        } else {
          $("#" + objError).html(jQuery.i18n.prop("linvalidNewPin"));
          $("#" + objError).show();
          return false;
        }
      }
      return false;
    };
    this.EnablePinCode = function () {
      $("#btnEnablePin").unbind("click");
      $("#btnEnablePin").bind("click", function () {
        var enablePin = $("#txtEnablePin").val();
        if (that.checkPin(enablePin, "lt_enabledPin_error")) {
          var jsonData = { command: 1, pin: enablePin };
          showWait();
          setTimeout(function () {
            postJSON("pin_puk", jsonData, function (data) {
              if (data.result == "success") {
                $("#divEnablePin input[type='password']").val("");
                that.CheckCmdStatus();
              } else {
                showMsgBox(
                  jQuery.i18n.prop("lt_EnablePin"),
                  jQuery.i18n.prop("lFailedWithUnkown")
                );
              }
            });
          });
        }
      });
    };
    this.EnterPinCode = function () {
      $("#btnEnterPin").unbind("click");
      $("#btnEnterPin").bind("click", function () {
        var enterPin = $("#txtEnterPin").val();
        if (that.checkPin(enterPin, "lt_enterPin_error")) {
          var jsonData = { command: 5, pin: enterPin };
          showWait();
          setTimeout(function () {
            postJSON("pin_puk", jsonData, function (data) {
              if (data.result == "success") {
                $("#divEnterPin input[type='password']").val("");
                that.CheckCmdStatus();
              } else {
                showMsgBox(
                  jQuery.i18n.prop("lt_EnablePin"),
                  jQuery.i18n.prop("lFailedWithUnkown")
                );
              }
            });
          }, 100);
        }
      });
    };
    this.DisablePinCode = function () {
      $("#btnDisablePin").unbind("click");
      $("#btnDisablePin").bind("click", function () {
        var disPin = $("#txtDisablePin").val();
        if (that.checkPin(disPin, "lt_disablePin_error")) {
          var jsonData = { command: 2, pin: disPin };
          showWait();
          setTimeout(function () {
            postJSON("pin_puk", jsonData, function (data) {
              if (data.result == "success") {
                $("#divDisablePin input[type='password']").val("");
                that.CheckCmdStatus();
              } else {
                showMsgBox(
                  jQuery.i18n.prop("lt_EnablePin"),
                  jQuery.i18n.prop("lFailedWithUnkown")
                );
              }
            });
          });
        }
      });
    };
    this.ChangePinCode = function () {
      $("#btnChangePin").unbind("click");
      $("#btnChangePin").bind("click", function () {
        var pin = $("#txtPIN").val(); //Enter Current PIN
        var pin1 = $("#txtchangePin1").val(); //Enter New PIN
        var pin2 = $("#txtchangePin2").val(); //Confirm New PIN
        if (that.checkChange(pin, pin1, pin2, "lt_changePin_error")) {
          var jsonData = { command: 3, pin: pin, new_pin: pin1 };
          showWait();
          setTimeout(function () {
            postJSON("pin_puk", jsonData, function (data) {
              if (data.result == "success") {
                $("#divChangePin input[type='password']").val("");
                that.CheckCmdStatus();
              } else {
                showMsgBox(
                  jQuery.i18n.prop("lt_EnablePin"),
                  jQuery.i18n.prop("lFailedWithUnkown")
                );
              }
            });
          });
        }
      });
    };
    this.EnterPukCode = function () {
      $("#btnEnterPuk").unbind("click");
      $("#btnEnterPuk").bind("click", function () {
        var puk = $("#txtEnterPuk").val();
        var pin1 = $("#txtEnterPukPin1").val();
        var pin2 = $("#txtEnterPukPin2").val();
        if (that.checkChange_puk(puk, pin1, pin2, "lt_enterPuk_error")) {
          var jsonData = { command: 4, puk: puk, new_pin: pin1 };
          showWait();
          setTimeout(function () {
            postJSON("pin_puk", jsonData, function (data) {
              if (data.result == "success") {
                $("#divEnterPuk input[type='password']").val("");
                that.CheckCmdStatus(data);
              } else {
                showMsgBox(
                  jQuery.i18n.prop("lt_EnablePin"),
                  jQuery.i18n.prop("lFailedWithUnkown")
                );
              }
            });
          });
        }
      });
    };
    this.CheckCmdStatus = function () {
      showWait();
      setTimeout(function () {
        callJSON("pin_puk", function (json) {
          var cmdStatus = json.cmd_status;

          if ("10" == cmdStatus) {
            // incorrect password
            if (parseInt(pin_attempts_gl) > 0) {
              showMsgBox(
                jQuery.i18n.prop("lWarning"),
                jQuery.i18n.prop("lt_enterPin_error")
              );
            } else {
              showMsgBox(
                jQuery.i18n.prop("lWarning"),
                jQuery.i18n.prop("PukPinPasswordError")
              );
            }
          } else if ("13" == cmdStatus) {
            //SIM CARD do not support this PIN code
            showMsgBox(
              jQuery.i18n.prop("lWarning"),
              jQuery.i18n.prop("lSimNotSupportPinCode")
            );
          } else if ("7" == cmdStatus) {
            //SIM PUK request
            showMsgBox(
              jQuery.i18n.prop("lWarning"),
              jQuery.i18n.prop("lSimPUKRequest")
            );
          } else if ("6" == cmdStatus) {
            showMsgBox(
              jQuery.i18n.prop("lWarning"),
              jQuery.i18n.prop("PukPinPasswordError")
            );
          }
          that.onLoad(false);
        });
      }, 100);
    };
    this.displayControls = function () {
      $("#spanEnablePin").html(jQuery.i18n.prop("lt_EnablePin"));
      $("#spanDisablePin").html(jQuery.i18n.prop("lt_DisablePin"));
      $("#spanChangePinCode").html(jQuery.i18n.prop("lt_ChangePin"));
      $("#spanEnterPukCode").html(jQuery.i18n.prop("lt_EnterPuk"));
      $("#lt_dashbd_PINStatus").html(jQuery.i18n.prop("lt_dashbd_PINStatus"));
      $("#lt_EnablePin").html(jQuery.i18n.prop("lt_Mep_PinCode"));
      $("#btnEnablePin").val(jQuery.i18n.prop("lt_EnablePin"));
      $("#lt_DisablePin").html(jQuery.i18n.prop("lt_Mep_PinCode"));
      $("#btnDisablePin").val(jQuery.i18n.prop("lt_DisablePin"));
      $("#lt_pin").html(jQuery.i18n.prop("lt_EnterPin"));
      $("#lt_Pin1").html(jQuery.i18n.prop("lt_EnterNewPin1"));
      $("#lt_Pin2").html(jQuery.i18n.prop("lt_EnterNewPin2"));
      $("#btnChangePin").val(jQuery.i18n.prop("lt_ChangePin"));
      $("#lt_Enterpuk").html(jQuery.i18n.prop("lt_EnterPuk"));
      $("#lt_EnterPukPin1").html(jQuery.i18n.prop("lt_EnterNewPin1"));
      $("#lt_EnterPukPin2").html(jQuery.i18n.prop("lt_EnterNewPin2"));
      $("#btnEnterPuk").val(jQuery.i18n.prop("lt_Mep_btnPukUnlock"));
      $("#spanEnterPinCode").html(jQuery.i18n.prop("spanEnterPin"));
      $("#lt_EnterPin").html(jQuery.i18n.prop("lt_Mep_PinCode"));
      $("#btnEnterPin").val(jQuery.i18n.prop("spanEnterPin"));
    };
    return this;
  };
})(jQuery);
// -------------------------------------------------------------objDeviceInfo-----------------------------------------------------------------
(function ($) {
  $.objDeviceInfo = function () {
    var that = this;
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
      }
      that.showData();
      setDlgStyle();
    };
    this.showData = function () {
      callJSON("altair_state", function (json) {
        $("#txt_plmn").html(json.operator_name);
        $("#txt_msisdn").html(json.MSISDN);
        var run_days = json.run_days;
        var run_hours = json.run_hours;
        var run_minutes = json.run_minutes;
        var run_seconds = json.run_seconds;
        if (parseInt(run_days) > 1) {
          run_days = run_days + " " + jQuery.i18n.prop("ldDays") + " ";
        } else {
          run_days = run_days + " " + jQuery.i18n.prop("ldDay") + " ";
        }
        if (parseInt(run_hours) < 10) {
          run_hours = "0" + parseInt(run_hours);
        }
        if (parseInt(run_minutes) < 10) {
          run_minutes = "0" + parseInt(run_minutes);
        }
        if (parseInt(run_seconds) < 10) {
          run_seconds = "0" + parseInt(run_seconds);
        }
        $("#txt_run_time").html(
          run_days + " " + run_hours + ":" + run_minutes + ":" + run_seconds
        );
        var Battery_charging = json.Battery_charging;
        var Battery_charge = json.Battery_charge;
        var Battery_connect = json.Battery_connect;
        if (Battery_connect == "0") {
          $("#txt_battery").html(jQuery.i18n.prop("lNoBattery"));
        } else {
          if (Battery_charging == "0") {
            $("#txt_battery").html(jQuery.i18n.prop("lUncharged"));
          } else {
            if (Battery_charge == "0") {
              $("#txt_battery").html(jQuery.i18n.prop("lUncharged"));
            } else if (Battery_charge == "1") {
              $("#txt_battery").html(jQuery.i18n.prop("lCharging"));
            } else if (Battery_charge == "2") {
              $("#txt_battery").html(jQuery.i18n.prop("lFullycharged"));
            } else if (Battery_charge == "3") {
              $("#txt_battery").html(jQuery.i18n.prop("lFullycharged"));
            }
          }
        }
        //$("#txt_battery_vol").html(json.Battery_voltage+"%");
        var level = json.Battery_voltage;
        var soc = parseInt(level);
        if (json.Battery_charge == 3 || json.Battery_charge == 2) {
          soc = 100;
        } else {
          soc = Math.floor((soc + 9) / 10) * 10;
        }
        //var level=json.Battery_voltage;
        if (soc <= 100 && soc >= 0) {
          $("#txt_battery_vol").html(soc + "%");
        } else {
          $("#txt_battery_vol").html("--");
        }
      });
      callJSON("wan_information", function (json) {
        $("#txt_imei").html(json.IMEI);
        $("#txt_network_name").html(UniDecode(json.ssid));
        $("#txt_devName").html(json.device_name);
        $("#txt_imsi").html(json.IMSI);
        $("#txt_max_access_number").html(json.max_clients);
        $("#txt_ip_address").html(json.lan_ip);
        $("#txt_mac_address").html(json.mac);
        $("#txt_wan_ip_address").html(json.wan_ip);
        $("#txt_hardware_version").html(json.hardware_version);
        // $("#txt_dns_ip4").html(json.ipv4);
        // $("#txt_dns_ip6").html(json.ipv6);
        $("#txt_software_version").html(json.version_num);
        // if(json.Engineering_mode=="1"){
        //     $("#deviceInfo_eng").show();
        // }else{
        //     $("#deviceInfo_eng").hide();
        // }
      });
      callJSON("Engineer_parameter", function (json) {
        $("#deviceInfo_eng_title").html("");
        if (json.sysmode == "17" && Object.keys(json.lte_info).length > 1) {
          $("#deviceInfo_eng_4g").show();
          $("#deviceInfo_eng_3g").hide();
          $("#deviceInfo_eng_title").html(
            jQuery.i18n.prop("4g_Engineer_title")
          );
          $("#txt_mcc").html(json.lte_info.mcc);
          $("#txt_tac").html(json.lte_info.tac);
          $("#txt_phy_cell_id").html(json.lte_info.phyCellId);
          $("#txt_dl_earfcn").html(json.lte_info.dlEuArfcn);
          $("#txt_ul_earfcn").html(json.lte_info.ulEuArfcn);
          $("#txt_dl_bandWidth").html(json.lte_info.band);
          $("#txt_cell_id").html(json.lte_info.cellId);
          var txt_rsrp = json.lte_info.rsrp;
          var txt_rsrq = json.lte_info.rsrq;
          var txt_rssi = json.lte_info.rssi;
          txt_rsrp = parseInt(txt_rsrp) - 141;
          txt_rsrq = -20 + txt_rsrq / 2;
          txt_rssi = parseInt(txt_rssi) - 128;
          $("#txt_rsrp").html(txt_rsrp + " dBm");
          $("#txt_rsrq").html(txt_rsrq + " dB");
          $("#txt_sinr").html(json.lte_info.sinr + " dB");
          $("#txt_rssi").html(txt_rssi + " dBm");
          $("#txt_dns_ecgi").html(json.lte_info.ECGI);
          $("#txt_dns_tx_power").html(json.lte_info.PuschTxPower);
          if (parseInt(json.lte_info.lenOfMnc) > json.lte_info.mnc.length) {
            var len =
              parseInt(json.lte_info.lenOfMnc) - json.lte_info.mnc.length;
            var str = "";
            while (len > 0) {
              str += "0";
              len--;
            }
            $("#txt_mnc").html(str + json.lte_info.mnc);
          } else {
            $("#txt_mnc").html(json.lte_info.mnc);
          }
          //$("#txt_mnc").html(json.lte_info.mnc);
        } else if (
          json.sysmode == "5" &&
          Object.keys(json.utms_info).length > 1
        ) {
          $("#deviceInfo_eng_3g").show();
          $("#deviceInfo_eng_4g").hide();
          $("#deviceInfo_eng_title").html(
            jQuery.i18n.prop("3g_Engineer_title")
          );
          $("#txt_3g_rac").html(json.utms_info.rac);
          $("#txt_3g_nom").html(json.utms_info.nom);
          $("#txt_3g_mcc").html(json.utms_info.mcc);
          $("#txt_3g_mnc").html(json.utms_info.mnc);
          $("#txt_3g_lac").html(json.utms_info.lac);
          $("#txt_3g_ci").html(json.utms_info.ci);
          $("#txt_3g_uraId").html(json.utms_info.uraId);
          $("#txt_3g_arfcn").html(json.utms_info.arfcn);
          $("#txt_3g_rscp").html(json.utms_info.rscp + " dBm");
          var txt_3g_rssi = json.utms_info.utraRssi;
          txt_3g_rssi = parseInt(txt_3g_rssi) - 111;
          $("#txt_3g_rssi").html(txt_3g_rssi + " dBm");
          $("#txt_3g_tx_power").html(json.utms_info.txPower);
          $("#txt_3g_hsdpa").html(json.utms_info.HSDPASupport);
          $("#txt_3g_hsupa").html(json.utms_info.HSUPASupport);
        }
      });
    };
    this.displayControls = function () {
      $("#lt_deviceInfo_title").html(jQuery.i18n.prop("mDeviceInfo"));
      $("#deviceInfo_imei").html(jQuery.i18n.prop("lt_dashbd_IMEI"));
      $("#deviceInfo_run_time").html(
        jQuery.i18n.prop("lt_dashbd_RouterRunTime")
      );
      $("#deviceInfo_imsi").html(jQuery.i18n.prop("key_deviceInfo_imsi"));
      $("#deviceInfo_msisdn").html(jQuery.i18n.prop("key_deviceInfo_msisdn"));
      $("#deviceInfo_battery").html(jQuery.i18n.prop("lt_dashbd_BetteryInfo"));
      $("#deviceInfo_battery_vol").html(
        jQuery.i18n.prop("lt_dashbd_BetteryVol")
      );
      $("#deviceInfo_network_name").html(jQuery.i18n.prop("lt_wifiSet_SSID"));
      $("#deviceInfo_devName").html(jQuery.i18n.prop("ltDeviceName"));
      $("#deviceInfo_plmn").html(
        jQuery.i18n.prop("lt_dashbd_NetworkOperatorName")
      );
      $("#deviceInfo_max_access_number").html(
        jQuery.i18n.prop("key_deviceInfo_max_clients")
      );
      $("#deviceInfo_ip_address").html(jQuery.i18n.prop("ltIPAddress"));
      $("#deviceInfo_mac_address").html(jQuery.i18n.prop("lMacAddr"));
      $("#deviceInfo_wan_ip_address").html(
        jQuery.i18n.prop("key_deviceInfo_wanIP")
      );
      $("#deviceInfo_software_version").html(
        jQuery.i18n.prop("lt_dashbd_SoftVersion")
      );
      $("#deviceInfo_hardware_version").html(
        jQuery.i18n.prop("lt_dashbd_HardVersion")
      );

      $("#deviceInfo_rsrp").html(jQuery.i18n.prop("deviceInfo_rsrp"));
      $("#deviceInfo_rsrq").html(jQuery.i18n.prop("deviceInfo_rsrq"));
      $("#deviceInfo_rssi").html(jQuery.i18n.prop("deviceInfo_rssi"));
      $("#deviceInfo_sinr").html(jQuery.i18n.prop("lt_dashbd_LTE_sinr"));
      $("#deviceInfo_mcc").html(jQuery.i18n.prop("lt_dashbd_LTE_mcc"));
      $("#deviceInfo_mnc").html(jQuery.i18n.prop("lt_dashbd_LTE_mnc"));
      $("#deviceInfo_tac").html(jQuery.i18n.prop("lt_dashbd_LTE_tac"));
      $("#deviceInfo_phy_cell_id").html(
        jQuery.i18n.prop("lt_dashbd_LTE_phy_cellid")
      );
      $("#deviceInfo_cell_id").html(jQuery.i18n.prop("lt_dashbd_LTE_cellid"));
      $("#deviceInfo_dl_earfcn").html(
        jQuery.i18n.prop("lt_dashbd_LTE_dl_euarfcn")
      );
      $("#deviceInfo_ul_earfcn").html(
        jQuery.i18n.prop("lt_dashbd_LTE_ul_euarfcn")
      );
      $("#deviceInfo_dl_bandWidth").html(
        jQuery.i18n.prop("lt_dashbd_LTE_dl_bandwidth")
      );
      $("#deviceInfo_dns_ecgi").html(jQuery.i18n.prop("deviceInfo_dns_ecgi"));
      $("#deviceInfo_dns_tx_power").html(
        jQuery.i18n.prop("deviceInfo_dns_tx_power")
      );

      $("#3g_rac").html(jQuery.i18n.prop("3g_rac"));
      $("#3g_nom").html(jQuery.i18n.prop("3g_nom"));
      $("#3g_mcc").html(jQuery.i18n.prop("3g_mcc"));
      $("#3g_mnc").html(jQuery.i18n.prop("3g_mnc"));
      $("#3g_lac").html(jQuery.i18n.prop("3g_lac"));
      $("#3g_ci").html(jQuery.i18n.prop("3g_ci"));
      $("#3g_uraId").html(jQuery.i18n.prop("3g_uraId"));
      $("#3g_arfcn").html(jQuery.i18n.prop("3g_arfcn"));
      $("#3g_rscp").html(jQuery.i18n.prop("3g_rscp"));
      $("#3g_rssi").html(jQuery.i18n.prop("3g_rssi"));
      $("#3g_tx_power").html(jQuery.i18n.prop("3g_tx_power"));
      $("#3g_hsdpa").html(jQuery.i18n.prop("3g_hsdpa"));
      $("#3g_hsupa").html(jQuery.i18n.prop("3g_hsupa"));
    };
    return this;
  };
})(jQuery);
// -------------------------------------------------------------objDHCP_Settings-----------------------------------------------------------------
var _arrayStaticIP = [];
var dhcp_Changeip3 = "1";
var c_ipControl_start;
var c_ipControl_end;
(function ($) {
  $.objDHCP_Settings = function () {
    var that = this;
    var c_rdRadio;
    var dhcpv6Server;
    var c_controlMapExisting = [];
    var c_controlMapCurrent = [];
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.btnEvent();
      }
      that.showData();
    };
    this.showData = function () {
      showWait();
      setTimeout(function () {
        callJSON("lan_setting_info", function (data) {
          closeWait();
          var ip = data.ip;
          var dhcpv6Server = data.dhcpv6server;
          var redirectionFunction = data.redirect_enable;
          var dnsEnable = data.dns_enable;
          var status = data.status;
          var start = data.start;
          var end = data.end;
          var leaseTime = data.lease_time;
          var val = ip.split(".");

          c_ipControl_start = start;
          c_ipControl_end = end;
          $("#textbox3").val(val[2]);
          dhcp_Changeip3 = val[2];
          $("#ipControl_starttext2").val(val[2]);
          $("#ipControl_endtext2").val(val[2]);
          $("#ip").html(ip);
          $("#ipControl_starttext0").val(val[0]);
          $("#ipControl_endtext0").val(val[0]);
          $("#ipControl_starttext1").val(val[1]);
          $("#ipControl_endtext1").val(val[1]);
          $("#ipControl_starttext2").val(val[2]);
          $("#ipControl_endtext2").val(val[2]);
          var startval = start.split(".");
          var endval = end.split(".");
          $("#ipControl_starttext3").val(startval[3]);
          $("#ipControl_endtext3").val(endval[3]);
          $("#tbdhcplt").val(leaseTime);

          $("#DNSEnableSwitchSel").val(dnsEnable);
          $("#txtDirectionURL").val(data.redirect_url);
          $("#txtDnsName1").val("0" == data.dns1 ? "" : data.dns1);
          $("#txtDnsName2").val("0" == data.dns2 ? "" : data.dns2);
          if (1 == redirectionFunction) {
            $("#divEnabledDirectionUrl").show();
            $("#RedirectionURLEnabled").attr("checked", true);
          } else {
            $("#divEnabledDirectionUrl").hide();
            $("#RedirectionURLDisabled").attr("checked", true);
          }
          if ("0" == dhcpv6Server) {
            $("#statelessServerRadio").attr("checked", true);
            $("#statefullServerRadio").attr("checked", false);
          } else {
            $("#statefullServerRadio").attr("checked", true);
            $("#statelessServerRadio").attr("checked", false);
          }
          if (status == "1") {
            $("#rdRadioEnabled").attr("checked", true);
          } else {
            $("#rdRadioDisabled").attr("checked", true);
          }
          rbDHCPClicked();
          DNSEnableSwitchChanged();
        });
        callJSON("Fixed_IP_list", function (data) {
          _arrayStaticIP = [];
          for (var i = 0; i < data.Fixed_IP_list.length; i++) {
            var IndexList = data.Fixed_IP_list[i];
            _arrayStaticIP.push([IndexList.index, IndexList.mac, IndexList.ip]);
          }
          that.loadTableData();
        });
      }, 100);
    };
    this.loadTableData = function () {
      var loadHTML = "";
      for (var i = 0; i < _arrayStaticIP.length; i++) {
        loadHTML +=
          "<tr><td>" +
          _arrayStaticIP[i][1] +
          '</td><td class="td_delete">' +
          _arrayStaticIP[i][2] +
          '<span class="dhcp_deleteData" onclick="deleteStaticIPAdd(\'' +
          _arrayStaticIP[i][0] +
          "')\">&times;</span></td></tr>";
      }
      $("#StaticIPAddListBody").html(loadHTML);
      setDlgStyle();
    };
    this.btnEvent = function () {
      $("#a_close_divStaticIP").unbind("click");
      $("#a_close_divStaticIP").bind("click", function () {
        $("#divStaticIPDlg").hide();
      });

      $("#a_cancel_divStaticIP").unbind("click");
      $("#a_cancel_divStaticIP").bind("click", function () {
        $("#divStaticIPDlg").hide();
      });

      $("#btnAddStaticIP").unbind("click");
      $("#btnAddStaticIP").bind("click", function () {
        if (document.getElementById("tableStaticIP").rows.length > 30) {
          showMsgBox(
            jQuery.i18n.prop("btnAddStaticIP"),
            jQuery.i18n.prop("MaxStaticIpError")
          );
          return;
        }
        setAddBoxHeigth("divStaticIPDlg");
        $("#divStaticIPDlg").show();
        document.getElementById("txtMac1").focus();
        $("#lMacIpError").hide();
        $("#divStaticIPDlg input[type='text']").val("");
      });

      $("#btUpdate").unbind("click");
      $("#btUpdate").bind("click", function () {
        if (that.isvalid()) {
          $("#lIPErrorMsg").hide();
          var dns1,
            dns2,
            dns_enable,
            end,
            start,
            lease_time,
            redirect_enable,
            status,
            ip;
          var changeIP = false;
          var jsonData = {};
          dns_enable = $("#DNSEnableSwitchSel").val();
          status = $("#rdRadioEnabled").is(":checked") ? 1 : 0;
          if (status == 1) {
            start =
              $("#ipControl_starttext0").val() +
              "." +
              $("#ipControl_starttext1").val() +
              "." +
              $("#ipControl_starttext2").val() +
              "." +
              $("#ipControl_starttext3").val();
            end =
              $("#ipControl_endtext0").val() +
              "." +
              $("#ipControl_endtext1").val() +
              "." +
              $("#ipControl_endtext2").val() +
              "." +
              $("#ipControl_endtext3").val();
            lease_time = $("#tbdhcplt").val();
            jsonData.status = "1";
            if (dns_enable == "1") {
              dns1 = $("#txtDnsName1").val();
              dns2 = $("#txtDnsName2").val();
              jsonData.dns_enable = "1";
              jsonData.dns1 = dns1;
              jsonData.dns2 = dns2;
            } else {
              jsonData.dns_enable = "0";
            }
            jsonData.start = start;
            jsonData.end = end;
            jsonData.lease_time = lease_time;

            var dhcpv6serverFlag = $("#statelessServerRadio").is(":checked")
              ? "0"
              : "1";
            if (dhcpv6serverFlag != dhcpv6Server) {
              jsonData.dhcpv6server = dhcpv6serverFlag;
            }
            var t3 = c_ipControl_start.split(".");
            ip = $("#ip").text();
            if ($("#textbox3").val() != t3[2]) {
              jsonData.ip = ip;
              changeIP = true;
            }

            if ($("#RedirectionURLEnabled").is(":checked")) {
              jsonData.redirect_url = $("#txtDirectionURL").val();
              jsonData.redirect_enable = "1";
            } else {
              jsonData.redirect_enable = "0";
            }
          } else {
            jsonData.status = "0";
          }
          showWait();
          setTimeout(function () {
            postJSON("lan_setting_info", jsonData, function (data) {
              if (data.result == "success") {
                that.onLoad(false);
              } else {
                showMsgBox(
                  jQuery.i18n.prop("mDHCP_Settings"),
                  jQuery.i18n.prop("dialog_message_dhcp_set_fail")
                );
              }
            });
            if (changeIP) {
              setTimeout(function () {
                window.location.host = ip;
              }, 1000);
            }
          }, 100);
        }
      });
    };
    this.isvalid = function () {
      $("#lIPErrorMsg").hide();
      var dhcpRange = "192.168." + $("#textbox3").val() + ".1";
      var txt3 = $("#textbox3").val();
      if (!IsNumber(txt3) || parseInt(txt3) > 255 || parseInt(txt3) < 0) {
        $("#lIPErrorMsg").show();
        $("#lIPErrorMsg").html(jQuery.i18n.prop("lIPErrorMsg"));
        return false;
      }
      if (dhcpRange == c_ipControl_start) {
        $("#lIPErrorMsg").show();
        $("#lIPErrorMsg").html(jQuery.i18n.prop("lDhcpStartAddrError"));
        return false;
      }
      var startIP = $("#ipControl_starttext3").val();
      var endIP = $("#ipControl_endtext3").val();
      if (!IsNumber(startIP) || !IsNumber(endIP)) {
        $("#lIPErrorMsg").show();
        $("#lIPErrorMsg").html(jQuery.i18n.prop("lIPErrorMsg"));
        return false;
      }
      if (
        parseInt(startIP) > 255 ||
        parseInt(startIP) < 2 ||
        parseInt(endIP) > 255 ||
        parseInt(endIP) < 2
      ) {
        $("#lIPErrorMsg").show();
        $("#lIPErrorMsg").html(jQuery.i18n.prop("lIPErrorMsg"));
        return false;
      }
      if (parseInt(startIP) >= parseInt(endIP)) {
        $("#lIPErrorMsg").show();
        $("#lIPErrorMsg").html(jQuery.i18n.prop("lDhcpAddrRangeError"));
        return false;
      }
      if (!IsNumber($("#tbdhcplt").val()) || $("#tbdhcplt").val() < 86400) {
        $("#lIPErrorMsg").show();
        $("#lIPErrorMsg").html(jQuery.i18n.prop("lErrorNumber2"));
        return false;
      }

      if ("1" == $("#DNSEnableSwitchSel").val()) {
        if (
          ("" != $("#txtDnsName1").val() && !IsIPv4($("#txtDnsName1").val())) ||
          ("" != $("#txtDnsName2").val() && !IsIPv4($("#txtDnsName2").val()))
        ) {
          $("#lIPErrorMsg").show();
          $("#lIPErrorMsg").html(jQuery.i18n.prop("lDnsIpError"));
          return false;
        }
      }
      return true;
    };
    this.displayControls = function () {
      $("#title").html(jQuery.i18n.prop("mDHCP_Settings"));
      $("#lDhcpRange").html(jQuery.i18n.prop("lDhcpRange"));
      $("#lDevLanIP").html(jQuery.i18n.prop("lDevLanIP"));
      $("#lDhcpServer").html(jQuery.i18n.prop("lDhcpServer"));
      $("#radio_En").html(jQuery.i18n.prop("lEnabled"));
      $("#raido_Dis").html(jQuery.i18n.prop("lDisabled"));
      $("#lDhcpStartAdd").html(jQuery.i18n.prop("lDhcpStartAdd"));
      $("#lDhcpEndAdd").html(jQuery.i18n.prop("lDhcpEndAdd"));
      $("#ldhcplt").html(jQuery.i18n.prop("ldhcplt"));
      $("#sTimeUint").html(jQuery.i18n.prop("lMinutes"));
      $("#DNSEnableSwitchLabel").html(jQuery.i18n.prop("DNSEnableSwitchLabel"));
      $("#ClosedivDNSEnableSwitch").html(
        jQuery.i18n.prop("lt_optDisabledSwitch")
      );
      $("#OpendivDNSEnableSwitch").html(jQuery.i18n.prop("lt_optEnableSwitch"));
      $("#lDnsName1").html(jQuery.i18n.prop("lDnsName1"));
      $("#lDnsName2").html(jQuery.i18n.prop("lDnsName2"));
      $("#lt_dhcp_stcRedirectionFunction").html(
        jQuery.i18n.prop("lt_dhcp_stcRedirectionFunction")
      );
      $("#lt_dhcp_stcRedirectionURLEnabled").html(
        jQuery.i18n.prop("lt_optEnableSwitch")
      );
      $("#lt_dhcp_stcRedirectionURLDisabled").html(
        jQuery.i18n.prop("lt_optDisabledSwitch")
      );
      $("#lt_dhcp_stRedirectionURL").html(
        jQuery.i18n.prop("lt_dhcp_stRedirectionURL")
      );
      $("#btnAddStaticIP").val(jQuery.i18n.prop("btnAddStaticIP"));
      $("#ltMacAddress").html(jQuery.i18n.prop("ltMacAddress"));
      $("#ltIPAddress").html(jQuery.i18n.prop("ltIPAddress"));
      $("#DHCPV6title").html(jQuery.i18n.prop("DHCPV6title"));
      $("#lDhcpV6Server").html(jQuery.i18n.prop("lDhcpV6Server"));
      $("#lstatelessServer").html(jQuery.i18n.prop("lstatelessServer"));
      $("#lstatefullServer").html(jQuery.i18n.prop("lstatefullServer"));
      $("#h1AddStaticIP").html(jQuery.i18n.prop("h1AddStaticIP"));
      $("#lStaticIP_MAC").html(jQuery.i18n.prop("lStaticIP_MAC"));
      $("#lStaticIP_IP").html(jQuery.i18n.prop("lStaticIP_IP"));
      $("#a_cancel_divStaticIP").html(jQuery.i18n.prop("lt_btnCancel"));
      $("#btnAdd_dhcp").val(jQuery.i18n.prop("btnAdd_dhcp"));
      $("#btUpdate").val(jQuery.i18n.prop("lt_btnSave"));
    };
    return this;
  };
})(jQuery);
function deleteStaticIPAdd(index) {
  var jsonData = {
    Fixed_IP_list: { delete: index, mac: _arrayStaticIP[parseInt(index)][1] },
  };
  showWait();
  setTimeout(function () {
    postJSON("Fixed_IP_list", jsonData, function (data) {
      if (data.result == "success") {
        $.objDHCP_Settings().onLoad(false);
      } else {
        showMsgBox(
          jQuery.i18n.prop("lt_dhcp_title"),
          jQuery.i18n.prop("dialog_message_dhcp_delete_static_ip_fail")
        );
      }
    });
  }, 100);
}
function btnAddStaticIPSetting() {
  var mac, ip;
  mac =
    $("#txtMac1").val() +
    ":" +
    $("#txtMac2").val() +
    ":" +
    $("#txtMac3").val() +
    ":" +
    $("#txtMac4").val() +
    ":" +
    $("#txtMac5").val() +
    ":" +
    $("#txtMac6").val();
  ip =
    $("#txtSrcIPAddress1").val() +
    "." +
    $("#txtSrcIPAddress2").val() +
    "." +
    $("#txtSrcIPAddress3").val() +
    "." +
    $("#txtSrcIPAddress4").val();

  var bMacAddrValid = validateMACAddress(mac);
  var bIpAddrValid = validateIPAddress(ip);
  $("#lMacIpError").hide();
  if (":::::" == mac) {
    $("#lMacIpError").show();
    $("#lMacIpError").html(jQuery.i18n.prop("MAC_ADDR_IS_EMPTY"));
    return;
  }
  if ("..." == ip) {
    $("#lMacIpError").show();
    $("#lMacIpError").html(jQuery.i18n.prop("IP_ADDR_IS_EMPTY"));
    return;
  }
  var lanIpAddr = $("#ip").text();
  /* if(lanIpAddr.split(".")[0] != ip.split(".")[0] || lanIpAddr.split(".")[1] != ip.split(".")[1] || lanIpAddr.split(".")[2] != ip.split(".")[2] || lanIpAddr.split(".")[3] == ip.split(".")[3]){
        $("#lMacIpError").show();
        var addrRange = " " + lanIpAddr.split(".")[0] + "." + lanIpAddr.split(".")[1] + "." + lanIpAddr.split(".")[2] + ".2 - " + lanIpAddr.split(".")[0] + "." + lanIpAddr.split(".")[1] + "." + lanIpAddr.split(".")[2] + ".255";
        $("#lMacIpError").html(jQuery.i18n.prop("lStaticIpAddrError") + addrRange);
        return;
    }   */
  if (
    lanIpAddr.split(".")[0] != ip.split(".")[0] ||
    lanIpAddr.split(".")[1] != ip.split(".")[1] ||
    dhcp_Changeip3 != ip.split(".")[2] ||
    ip.split(".")[3] < parseInt(c_ipControl_start.split(".")[3]) ||
    ip.split(".")[3] > parseInt(c_ipControl_end.split(".")[3])
  ) {
    $("#lMacIpError").show();
    var addrRange = " " + c_ipControl_start + "-" + c_ipControl_end;
    $("#lMacIpError").html(jQuery.i18n.prop("lStaticIpAddrError") + addrRange);
    return;
  }
  var bMacIpExist = false;
  for (var idx = 0; idx < _arrayStaticIP.length; ++idx) {
    if (mac == _arrayStaticIP[idx][1] || ip == _arrayStaticIP[idx][2]) {
      bMacIpExist = true;
      break;
    }
  }
  if (bMacIpExist) {
    $("#lMacIpError").show();
    $("#lMacIpError").html(jQuery.i18n.prop("lMacIpExist"));
    return;
  }
  if (bMacAddrValid && bIpAddrValid) {
    $("#divStaticIPDlg").hide();
    showWait();
    setTimeout(function () {
      var jsonData = { Fixed_IP_list: { index: 1, mac: mac, ip: ip } };
      postJSON("Fixed_IP_list", jsonData, function (data) {
        if (data.result == "success") {
          $.objDHCP_Settings().onLoad(false);
        } else {
          showMsgBox(
            jQuery.i18n.prop("h1AddStaticIP"),
            jQuery.i18n.prop("ls_save_time_failure")
          );
        }
      });
    }, 100);
  } else {
    $("#lMacIpError").show();
    if (!bMacAddrValid) {
      $("#lMacIpError").html(jQuery.i18n.prop("MAC_IS_NOT_VALID"));
    } else if (!bIpAddrValid) {
      $("#lMacIpError").html(jQuery.i18n.prop("IP_IS_NOT_VALID"));
    }
  }
}
function drpdwn_DHCP_rangeChanged() {
  var ip3 = $("#textbox3").val();
  if (ip3 == "") {
    return false;
  }
  if (!IsNumber(ip3) || parseInt(ip3) > 255 || parseInt(ip3) < 0) {
    $("#textbox3").val(dhcp_Changeip3);
  }
  var value = "192.168.";
  $("#textbox3").val(parseInt(ip3));
  $("#ipControl_starttext2").val(parseInt(ip3));
  $("#ipControl_endtext2").val(parseInt(ip3));
  $("#ip").html(value + parseInt(ip3) + ".1");
}
function startText_rangeChanged() {
  var ip3 = $("#ipControl_starttext3").val();
  if (ip3 == "") {
    return false;
  }
  $("#ipControl_starttext3").val(parseInt(ip3));
}
function endText_rangeChanged() {
  var ip3 = $("#ipControl_endtext3").val();
  if (ip3 == "") {
    return false;
  }
  $("#ipControl_endtext3").val(parseInt(ip3));
}
function dhcplt_rangeChanged() {
  var dhcplt = $("#tbdhcplt").val();
  if (dhcplt == "") {
    return false;
  }
  $("#tbdhcplt").val(parseInt(dhcplt));
}
function SrcIPAddress4_rangeChanged() {
  var txtSrcIPAddress4 = $("#txtSrcIPAddress4").val();
  if (txtSrcIPAddress4 == "") {
    return false;
  }
  $("#txtSrcIPAddress4").val(parseInt(txtSrcIPAddress4));
}
function DNSEnableSwitchChanged() {
  if (0 == $("#DNSEnableSwitchSel").val()) {
    $("#txtDnsName1").attr("readonly", true);
    $("#txtDnsName2").attr("readonly", true);
    $("#txtDnsName1").attr("disabled", true);
    $("#txtDnsName2").attr("disabled", true);
    $("#txtDnsName1").css("backgroundColor", "#ddd");
    $("#txtDnsName2").css("backgroundColor", "#ddd");
  } else {
    $("#txtDnsName1").attr("readonly", false);
    $("#txtDnsName2").attr("readonly", false);
    $("#txtDnsName1").attr("disabled", false);
    $("#txtDnsName2").attr("disabled", false);
    $("#txtDnsName1").css("backgroundColor", "#fff");
    $("#txtDnsName2").css("backgroundColor", "#fff");
  }
}
function rbDHCPClicked() {
  if ($("#rdRadioEnabled").is(":checked")) {
    $("#divEnabledDisabledContent").show();
    $("#textbox3").attr("disabled", false);
    $("#divStaticIpAddrList").show();
  }
  if ($("#rdRadioDisabled").is(":checked")) {
    $("#divEnabledDisabledContent").hide();
    $("#textbox3").attr("disabled", true);
    $("#divStaticIpAddrList").hide();
  }
  setDlgStyle();
}
function RedirectionURLEnabled() {
  if ($("#RedirectionURLEnabled").is(":checked")) {
    $("#divEnabledDirectionUrl").show();
  } else {
    $("#divEnabledDirectionUrl").hide();
  }
}
// -------------------------------------------------------------objConnectedDev-----------------------------------------------------------------
(function ($) {
  $.objConnectedDev = function () {
    var that = this;
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
      }
      setDlgStyle();
      that.showData();
    };
    this.showData = function () {
      callJSON("device_management_all", function (json) {
        var index, name, connType, connTime, macAdd, ipAdd;
        var uArr = json.Item;
        var htmlText;
        for (var i = 0; i < uArr.length; i++) {
          var uJSON = uArr[i];
          index = uJSON.index;
          name = UniDecode(uJSON.name);
          connType = uJSON.conn_type;
          connTime = uJSON.conn_time;
          connTime = connTime.replace("hours", jQuery.i18n.prop("ld_h"));
          connTime = connTime.replace("mins", jQuery.i18n.prop("ld_m"));
          connTime = connTime.replace("secs", jQuery.i18n.prop("ld_s"));
          macAdd = uJSON.mac;
          ipAdd = uJSON.ip_address;
          htmlText +=
            '<tr><td><span name="' +
            index +
            "*&*" +
            name +
            "*&*" +
            ipAdd +
            '">' +
            name +
            '</span></td><td><img src="images/status-icon3.png"></td><td>' +
            ipAdd +
            "</td><td>" +
            macAdd +
            "</td><td>" +
            connType +
            "</td><td>" +
            connTime +
            "</td></tr>";
        }
        $("#users_tbody").html(htmlText);
      });
    };
    this.displayControls = function () {
      $("#title").html(jQuery.i18n.prop("mInternetConn"));
      $("#lt_Name").html(jQuery.i18n.prop("lt_Name"));
      $("#lt_DeviceStatus").html(jQuery.i18n.prop("lt_DeviceStatus"));
      $("#lt_IpAddress").html(jQuery.i18n.prop("lt_IpAddress"));
      $("#lt_Mac").html(jQuery.i18n.prop("lt_Mac"));
      $("#lt_Connection").html(jQuery.i18n.prop("lt_Connection"));
      $("#lt_Time").html(jQuery.i18n.prop("lt_Time"));
    };
    return this;
  };
})(jQuery);
// -------------------------------------------------------------objDataTraffic-----------------------------------------------------------------
var clientArr = [];
var connItemArr = [];
(function ($) {
  $.objDataTraffic = function () {
    var that = this;
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.btnEvent();
      }
      that.showData();
      setDlgStyle();
    };
    this.showData = function () {
      callJSON("device_management_all", function (json) {
        var name, connTime, macAdd, status, action, ipadd;
        var uArr = json.client_list;
        var htmlText;
        action = "";
        clientArr = [];
        connItemArr = [];
        clientArr = json.client_list;
        connItemArr = json.Item;
        for (var i = 0; i < uArr.length; i++) {
          var uJSON = uArr[i];
          name = UniDecode(uJSON.N);
          macAdd = uJSON.M;
          connTime = getTimeToS(parseInt(uJSON.Tf));
          status = uJSON.Ct;
          ipadd = uJSON.IP;
          if (status != "USB") {
            if (uJSON.Stat == "1") {
              action =
                '<input class="btn-apply" name="' +
                name +
                "*&*" +
                macAdd +
                '" value="' +
                jQuery.i18n.prop("lBlock") +
                '" style="width:70px;padding:0 10px;"  type="button" onclick="setBlockStatus(this)" /> <input class="btn-apply" style="width:60px;padding:0 10px;" value="' +
                jQuery.i18n.prop("lStop") +
                '" name="' +
                name +
                "*&*" +
                macAdd +
                '"  type="button" onclick="SetStopStatus(this)" />';
            } else if (uJSON.Stat == "0") {
              action =
                '<input class="btn-apply" name="' +
                name +
                "*&*" +
                macAdd +
                '" value="' +
                jQuery.i18n.prop("lBlock") +
                '" style="width:70px;padding:0 10px;"  type="button" onclick="setBlockStatus(this)" />';
            } else if (uJSON.Stat == "2") {
              action =
                '<input class="btn-apply" name="' +
                name +
                "*&*" +
                macAdd +
                '" value="' +
                jQuery.i18n.prop("lUnBlock") +
                '" style="width:80px;padding:0 10px;"   type="button" onclick="SetUnblockStatus(this)" />';
            } else {
              action = jQuery.i18n.prop("lUnkownStatus");
            }
          } else {
            action = "";
          }
          htmlText +=
            '<tr><td><span style="cursor:pointer;color:#05bda1;" name="' +
            name +
            "*&*" +
            macAdd +
            '" onclick="showConntedDeviceList(this)">' +
            name +
            "</span></td><td>" +
            macAdd +
            "</td><td>" +
            ipadd +
            "</td><td>" +
            connTime +
            "</td><td>" +
            status +
            "</td><td>" +
            action +
            "</td></tr>";
        }
        $("#DeviceInfoBody").html(htmlText);
      });
    };
    this.btnEvent = function () {
      $("#a_close_DeviceInfo").unbind("click");
      $("#a_close_DeviceInfo").bind("click", function () {
        $("#divDeviceInfoDlg").hide();
      });
      $("#lBtnOk").unbind("click");
      $("#lBtnOk").bind("click", function () {
        $("#divDeviceInfoDlg").hide();
      });
      $("#lBtnResetDevices").unbind("click");
      $("#lBtnResetDevices").bind("click", function () {
        var jsonData = { action: 4 };
        showWait();
        setTimeout(function () {
          postJSON("device_management_all", jsonData, function (data) {
            if (data.result == "success") {
              // showMsgBox(jQuery.i18n.prop("lBtnResetDevices"),jQuery.i18n.prop("dialog_message_connectdevice_traffic_reset_clients_traffic_success"));
              that.onLoad(false);
            } else {
              showMsgBox(
                jQuery.i18n.prop("lBtnResetDevices"),
                jQuery.i18n.prop(
                  "dialog_message_connectdevice_traffic_reset_clients_traffic_fail"
                )
              );
            }
          });
        }, 100);
      });
    };
    this.displayControls = function () {
      $("#ltitle").html(jQuery.i18n.prop("lt_connected_wlan_clients"));
      $("#lIpAddr1").html(jQuery.i18n.prop("lIpAddr"));
      $("#lBtnOk").val(jQuery.i18n.prop("lt_btnOK"));
      $("#lBtnResetDevices").val(jQuery.i18n.prop("lBtnResetDevices"));
      $("#lClientName").html(jQuery.i18n.prop("lClientName"));
      $("#lMacAddr").html(jQuery.i18n.prop("lMacAddress"));
      $("#lt_Time").html(jQuery.i18n.prop("lt_Time"));
      $("#lt_Connection").html(jQuery.i18n.prop("lt_Connection"));
      $("#lAction").html(jQuery.i18n.prop("lAction"));
      $("#lDeviceInfoBoxTitle").html(jQuery.i18n.prop("lDeviceInfoBoxTitle"));
      $("#lDeviceName").html(jQuery.i18n.prop("lDeviceName"));
      $("#lNameType").html(jQuery.i18n.prop("lNameType"));
      $("#lDeviceStatus").html(jQuery.i18n.prop("lDeviceStatus"));
      $("#lConnType").html(jQuery.i18n.prop("lConnType"));
      $("#lIpAddr").html(jQuery.i18n.prop("lIpAddr"));
      $("#lMacAddress").html(jQuery.i18n.prop("lMacAddress"));
      $("#lLastConTime").html(jQuery.i18n.prop("lLastConTime"));
      $("#lTotalConTime").html(jQuery.i18n.prop("lTotalConTime"));
      $("#lMonthSendData").html(jQuery.i18n.prop("lMonthSendData"));
      $("#lMonthRecvData").html(jQuery.i18n.prop("lMonthRecvData"));
      $("#lMonthTotalData").html(jQuery.i18n.prop("lMonthTotalData"));
      $("#lLast3DaySendData").html(jQuery.i18n.prop("lLast3DaySendData"));
      $("#lLast3DayRecvData").html(jQuery.i18n.prop("lLast3DayRecvData"));
      $("#lLast3DayTotalData").html(jQuery.i18n.prop("lLast3DayTotalData"));
      $("#lTotalSendData").html(jQuery.i18n.prop("lTotalSendData"));
      $("#lTotalRecvData").html(jQuery.i18n.prop("lTotalRecvData"));
      $("#lTotalData").html(jQuery.i18n.prop("lTotalData"));
    };
    return this;
  };
})(jQuery);
function SetUnblockStatus(input) {
  var indexName = $(input).attr("name");
  var indexArr = indexName.split("*&*");
  var name = indexArr[0];
  var macAdd = indexArr[1];
  var jsonData = { action: "3", mac: macAdd };
  showWait();
  setTimeout(function () {
    postJSON("device_management_all", jsonData, function (data) {
      if (data.result == "success") {
        $.objDataTraffic().onLoad(false);
      } else {
        showMsgBox(
          jQuery.i18n.prop("lUnBlock"),
          jQuery.i18n.prop(
            "dialog_message_connectdevice_traffic_set_unblock_fail"
          )
        );
      }
    });
  }, 100);
}
function SetStopStatus(input) {
  var indexName = $(input).attr("name");
  var indexArr = indexName.split("*&*");
  var name = indexArr[0];
  var macAdd = indexArr[1];
  var jsonData = { action: "1", mac: macAdd };
  showWait();
  setTimeout(function () {
    postJSON("device_management_all", jsonData, function (data) {
      if (data.result == "success") {
        $.objDataTraffic().onLoad(false);
      } else {
        showMsgBox(
          jQuery.i18n.prop("lStop"),
          jQuery.i18n.prop(
            "dialog_message_connectdevice_traffic_set_block_fail"
          )
        );
      }
    });
  }, 100);
}
function setBlockStatus(input) {
  var indexName = $(input).attr("name");
  var indexArr = indexName.split("*&*");
  var name = indexArr[0];
  var macAdd = indexArr[1];
  var jsonData = { action: "2", mac: macAdd };
  setTimeout(function () {
    postJSON("device_management_all", jsonData, function (data) {
      if (data.result == "success") {
        $.objDataTraffic().onLoad(false);
      } else {
        showMsgBox(
          jQuery.i18n.prop("lBlock"),
          jQuery.i18n.prop(
            "dialog_message_connectdevice_traffic_set_block_fail"
          )
        );
      }
    });
  }, 100);
}
function showConntedDeviceList(span) {
  var indexName = $(span).attr("name");
  var indexArr = indexName.split("*&*");
  var name = indexArr[0];
  var macAdd = indexArr[1];
  for (var i = 0; i < clientArr.length; i++) {
    var cJSON = clientArr[i];
    if (name == UniDecode(cJSON.N) && macAdd == cJSON.M) {
      $("#txtDeviceName").html(UniDecode(cJSON.N));
      if (cJSON.NT == "1") {
        $("#deviceNameAssignedSel").html(jQuery.i18n.prop("lNameTypeAssigned"));
      } else {
        $("#deviceNameAssignedSel").html(
          jQuery.i18n.prop("lNameTypeNotAssigned")
        );
      }
      if (cJSON.Stat == "0") {
        $("#deviceStatusSel").html(jQuery.i18n.prop("DisconnectedStatus"));
      } else if (cJSON.Stat == "1") {
        $("#deviceStatusSel").html(jQuery.i18n.prop("ConnectedStatus"));
      } else if (cJSON.Stat == "2") {
        $("#deviceStatusSel").html(jQuery.i18n.prop("BlockStatus"));
      }
      $("#ConnTypeSel").html(cJSON.Ct);
      $("#txtIpAddr").html(cJSON.IP);
      $("#txtMacAddr").html(cJSON.M);
      $("#txtLastConTime").html(cJSON.Ta);
      $("#txtTotalConTime").html(getTimeToS(parseInt(cJSON.Tf)));
      $("#txtMonthSendData").html(
        FormatDataTrafficMinUnitKB(parseInt(cJSON.rxm))
      );
      $("#txtMonthRecvData").html(
        FormatDataTrafficMinUnitKB(parseInt(cJSON.txm))
      );
      $("#txtMonthTotalData").html(
        FormatDataTrafficMinUnitKB(parseInt(cJSON.rxm) + parseInt(cJSON.txm))
      );
      $("#txtLast3DaySendData").html(
        FormatDataTrafficMinUnitKB(parseInt(cJSON.rx3))
      );
      $("#txtLast3DayRecvData").html(
        FormatDataTrafficMinUnitKB(parseInt(cJSON.tx3))
      );
      $("#txtLast3DayTotalData").html(
        FormatDataTrafficMinUnitKB(parseInt(cJSON.rx3) + parseInt(cJSON.tx3))
      );
      $("#txtTotalSendData").html(
        FormatDataTrafficMinUnitKB(parseInt(cJSON.rx))
      );
      $("#txtTotalRecvData").html(
        FormatDataTrafficMinUnitKB(parseInt(cJSON.tx))
      );
      $("#txtTotalData").html(
        FormatDataTrafficMinUnitKB(parseInt(cJSON.tx) + parseInt(cJSON.rx))
      );
    }
  }
  setAddBoxHeigth("divDeviceInfoDlg");
  $("#divDeviceInfoDlg").show();
}
// -------------------------------------------------------------objTrafficStatistical-----------------------------------------------------------------
(function ($) {
  $.objTrafficStatistical = function () {
    var that = this;
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.clearData();
      }
      that.showData();
      setDlgStyle();
    };
    this.showData = function () {
      callJSON("statistics", function (json) {
        var f_rx_data = parseInt(json.rx_byte_all);
        var f_tx_data = parseInt(json.tx_byte_all);
        var p_rx_data = parseInt(json.rx_byte);
        var p_tx_data = parseInt(json.tx_byte);

        $("#txtRxByteFromPower").html(FormatDataTrafficMinUnitKB(p_rx_data));
        $("#txtTxByteFromPower").html(FormatDataTrafficMinUnitKB(p_tx_data));
        $("#txtRxTxByteFromPower").html(
          FormatDataTrafficMinUnitKB(p_rx_data + p_tx_data)
        );
        $("#txtRxByteFromRestoreFactory").html(
          FormatDataTrafficMinUnitKB(f_rx_data)
        );
        $("#txtTxByteFromRestoreFactory").html(
          FormatDataTrafficMinUnitKB(f_tx_data)
        );
        $("#txtRxTxByteFromRestoreFactory").html(
          FormatDataTrafficMinUnitKB(f_rx_data + f_tx_data)
        );
      });
    };
    this.clearData = function () {
      $("#lt_commTraffic_btnClearData").unbind("click");
      $("#lt_commTraffic_btnClearData").bind("click", function () {
        var jsonData = { reset: "1" };
        showWait();
        setTimeout(function () {
          postJSON("statistics", jsonData, function (data) {
            if (data.result == "success") {
              showMsgBox(
                jQuery.i18n.prop("lt_commTraffic_btnClearData"),
                jQuery.i18n.prop(
                  "dialog_message_traffic_statistic_clear_monitor_data_success"
                )
              );
              that.onLoad(false);
            } else {
              showMsgBox(
                jQuery.i18n.prop("lt_commTraffic_btnClearData"),
                jQuery.i18n.prop(
                  "dialog_message_traffic_statistic_clear_monitor_data_fail"
                )
              );
            }
          });
        }, 100);
      });
    };
    this.displayControls = function () {
      $("#lt_commTraffic_StaticFromPowerOn").html(
        jQuery.i18n.prop("lt_commTraffic_StaticFromPowerOn")
      );
      $("#lt_commTraffic_TitleFromPowerOn").html(
        jQuery.i18n.prop("lt_commTraffic_TitleFromPowerOn")
      );
      $("#lt_commTraffic_RxByte").html(
        jQuery.i18n.prop("lt_commTraffic_RxByte")
      );
      $("#lt_portTrigger_TxByte").html(
        jQuery.i18n.prop("lt_portTrigger_TxByte")
      );
      $("#lt_portTrigger_RxTxByte").html(
        jQuery.i18n.prop("lt_portTrigger_RxTxByte")
      );
      $("#ltFromRestore_commTraffic_RxByte").html(
        jQuery.i18n.prop("lt_commTraffic_RxByte")
      );
      $("#ltFromRestore_portTrigger_TxByte").html(
        jQuery.i18n.prop("lt_portTrigger_TxByte")
      );
      $("#ltFromRestore_portTrigger_RxTxByte").html(
        jQuery.i18n.prop("lt_portTrigger_RxTxByte")
      );
      $("#lt_commTraffic_btnClearData").val(
        jQuery.i18n.prop("lt_commTraffic_btnClearData")
      );
      $("#lt_commTraffic_TitleFromRestoreFactory").html(
        jQuery.i18n.prop("lt_commTraffic_TitleFromRestoreFactory")
      );
      $("#lt_commTraffic_StaticFromRestoreFactory").html(
        jQuery.i18n.prop("lt_commTraffic_StaticFromRestoreFactory")
      );
    };
    return this;
  };
})(jQuery);
// -------------------------------------------------------------objNetworkActivity-----------------------------------------------------------------
(function ($) {
  $.objNetworkActivity = function () {
    var that = this;
    var MAX_LOG_NUM = 300;
    var LOG_NUM_PER_PAGE = 10;
    var currentActiveDialPageIdx = 1;
    var currentActiveClientPageIdx = 1;
    var pageInitFlag = true;
    var refreshLogType = "";

    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.bindEvent();
      }
      that.showData();
      setDlgStyle();
    };
    this.showData = function () {
      UpdateLogList(1, "0", true);
    };
    this.displayControls = function () {
      $("#title").html(jQuery.i18n.prop("mNetworkActivity"));
      $("#lDateValue").html(jQuery.i18n.prop("lLogintime"));
      $("#lAccessLogs").html(jQuery.i18n.prop("lt_log_lAccessLogs"));
      $("#th_PdpName").html(jQuery.i18n.prop("lt_log_PdpName"));
      $("#th_Cid").html(jQuery.i18n.prop("lt_log_Cid"));
      $("#th_ACStartTime").html(jQuery.i18n.prop("lt_log_ACStartTime"));
      $("#th_ACEndTime").html(jQuery.i18n.prop("lt_log_ACEndTime"));
      $("#th_IPType").html(jQuery.i18n.prop("lt_log_IPType"));
      $("#th_IPv4Addr").html(jQuery.i18n.prop("lt_log_IPv4Addr"));
      $("#th_IPv6Addr").html(jQuery.i18n.prop("lt_log_IPv6Addr"));
      $("#lClientAccessLogs").html(jQuery.i18n.prop("lClientAccessLogs"));
      $("#th_ACMACAddr").html(jQuery.i18n.prop("ltACMACAddr"));
      $("#th_ACConTime").html(jQuery.i18n.prop("ltACConTime"));
      $("#th_DisconTime").html(jQuery.i18n.prop("ltDisconTime"));
      $("#ltDialLogDeleteBtn").val(jQuery.i18n.prop("lDelAccount"));
      $("#ltClientLogDeleteBtn").val(jQuery.i18n.prop("lDelAccount"));
    };
    this.bindEvent = function () {
      $("#ltDialLogDeleteBtn").click(function () {
        var delId = "";
        $(".delCheckBox:checked").each(function () {
          delId = delId + $(this).attr("id") + ",";
        });

        var jsonData = {};
        jsonData.delete_dial_log_index = delId;
        postJSON("detailed_log", jsonData, function (data) {
          if (0 == data.delete_dial_log_result) {
            if (
              currentActiveDialPageIdx != 1 &&
              $("#deleteAllDialLog").attr("checked")
            ) {
              currentActiveDialPageIdx--;
            }

            $("#deleteAllDialLog").attr("checked", false);
            UpdateLogList(currentActiveDialPageIdx, "1", true);
          } else {
            alert("delete log failed.");
          }
        });
      });
      $("#ltClientLogDeleteBtn").click(function () {
        var delId = "";

        $(".delCheckBox1:checked").each(function () {
          delId = delId + $(this).attr("id") + ",";
        });

        var jsonData = {};
        jsonData.delete_client_log_index = delId;

        postJSON("detailed_log", jsonData, function (data) {
          if (0 == data.delete_client_log_result) {
            if (
              currentActiveClientPageIdx != 1 &&
              $("#deleteAllClientLog").attr("checked")
            ) {
              currentActiveClientPageIdx--;
            }

            $("#deleteAllClientLog").attr("checked", false);
            UpdateLogList(currentActiveClientPageIdx, "0", true);
          } else {
            alert("delete log failed.");
          }
        });
      });
    };

    function UpdateLogList(pageNumber, logType, bInitFlag) {
      var jsonData = {};
      if (bInitFlag) {
        jsonData.dial_log_page_num = pageNumber;
        jsonData.client_log_page_num = pageNumber;
      } else if (logType == "1") {
        jsonData.dial_log_page_num = pageNumber;
      } else {
        jsonData.client_log_page_num = pageNumber;
      }
      pageInitFlag = bInitFlag;
      refreshLogType = logType;

      postJSON("detailed_log", jsonData, function (data) {
        LogListResult(data);
      });
    }

    function LogListResult(data) {
      if (pageInitFlag) {
        var dialLogCount = parseInt(data.dial_log_num);
        var clientLogCount = parseInt(data.client_log_num);
        var login_time = data.login_time;

        if ("" != login_time) {
          var arrLoginTime = login_time.split(" ");
          login_time =
            arrLoginTime[1] +
            "/" +
            arrLoginTime[2] +
            "/" +
            arrLoginTime[0] +
            " " +
            arrLoginTime[3];
        }
        document.getElementById("lDateValue").innerHTML =
          jQuery.i18n.prop("lLogintime") + " " + login_time;

        $("#DialLogList").empty();
        $("#deleteAllDialLog").attr("checked", false);
        RefreshDialLogDeleteBtn(true);

        $("#ClientLogList").empty();
        $("#deleteAllClientLog").attr("checked", false);
        RefreshClientLogDeleteBtn(true);

        var dialLogPageNum = Math.floor(dialLogCount / LOG_NUM_PER_PAGE);
        if (dialLogCount % LOG_NUM_PER_PAGE) {
          dialLogPageNum = dialLogPageNum + 1;
        }
        InitDialLogPageNum(dialLogPageNum);

        var clientLogPageNum = Math.floor(clientLogCount / LOG_NUM_PER_PAGE);
        if (clientLogCount % LOG_NUM_PER_PAGE) {
          clientLogPageNum = clientLogPageNum + 1;
        }
        InitClientLogPageNum(clientLogPageNum);

        var SelPage = currentActiveDialPageIdx - 1;
        var $Selector = "#divDialLogPageNum a:eq(" + SelPage + ")";
        $($Selector).css("color", "blue");
        $($Selector).siblings().css("color", "red");
        $($Selector).addClass("pageSelIdx");
        $($Selector).siblings().removeClass("pageSelIdx");

        var SelClientPage = currentActiveClientPageIdx - 1;
        $Selector = "#divClientLogPageNum a:eq(" + SelClientPage + ")";
        $($Selector).css("color", "blue");
        $($Selector).siblings().css("color", "red");
        $($Selector).addClass("pageSelIdx");
        $($Selector).siblings().removeClass("pageSelIdx");
      } else {
        if (refreshLogType == "1") {
          $("#DialLogList").empty();
          $("#deleteAllDialLog").attr("checked", false);
          RefreshDialLogDeleteBtn(true);
        } else {
          $("#ClientLogList").empty();
          $("#deleteAllClientLog").attr("checked", false);
          RefreshClientLogDeleteBtn(true);
        }
      }
      var _arrayDetailedLog = data.dial_log_entries;
      for (var i = 0; i < _arrayDetailedLog.length; i++) {
        var dialLogID = _arrayDetailedLog[i].id;
        var dialLogStartTime = _arrayDetailedLog[i].start_time;
        var dialLogEndTime = _arrayDetailedLog[i].end_time;
        var dialLogCid = _arrayDetailedLog[i].cid;
        var dialLogIpType = _arrayDetailedLog[i].ip_type;
        var dialLogPdpName = _arrayDetailedLog[i].pdp_name;
        var dialLogIpAddr = _arrayDetailedLog[i].ip_addr;
        var dialLogIpv6Addr = _arrayDetailedLog[i].ipv6_addr;

        AddDialLogToList(
          dialLogID,
          dialLogCid,
          dialLogStartTime,
          dialLogEndTime,
          dialLogIpType,
          dialLogIpAddr,
          dialLogIpv6Addr,
          dialLogPdpName
        );
      }
      var _arrayConTimeLog = data.client_log_entries;
      for (var i = 0; i < _arrayConTimeLog.length; i++) {
        var clientLogID = _arrayConTimeLog[i].id;
        var clientLogMac = _arrayConTimeLog[i].wifimac;
        var clientLogConTime = _arrayConTimeLog[i].con_time;
        var clientLogDisconTime = _arrayConTimeLog[i].discon_time;

        AddClientLogToList(
          clientLogID,
          clientLogMac,
          clientLogConTime,
          clientLogDisconTime
        );
      }
    }

    function RefreshDialLogDeleteBtn(bDisabledBtn) {
      if (bDisabledBtn) {
        $("#ltDialLogDeleteBtn").attr("disabled", true);
      } else {
        $("#ltDialLogDeleteBtn").attr("disabled", false);
      }
    }

    function RefreshClientLogDeleteBtn(bDisabledBtn) {
      if (bDisabledBtn) {
        $("#ltClientLogDeleteBtn").attr("disabled", true);
      } else {
        $("#ltClientLogDeleteBtn").attr("disabled", false);
      }
    }

    function InitDialLogPageNum(totalPageNum) {
      var htmlTxt = "";
      for (var idx = 1; idx <= totalPageNum; ++idx) {
        var html =
          '<a style="color: red; font-weight: 700; text-decoration: underline;margin-left:3px;cursor:pointer;" href="##">' +
          idx +
          "</a>";
        htmlTxt += html;
      }
      document.getElementById("divDialLogPageNum").innerHTML = htmlTxt;

      $("#divDialLogPageNum").click(function (event) {
        if ($(event.target).is("a")) {
          $(event.target).css("color", "blue");
          $(event.target).addClass("pageSelIdx");
          $(event.target).siblings().css("color", "red");
          $(event.target).siblings().removeClass("pageSelIdx");
          var pageIdx = $(event.target).text();
          currentActiveDialPageIdx = pageIdx;
          $("#deleteAllDialLog").attr("checked", false);
          RefreshDialLogDeleteBtn(true);
          UpdateLogList(pageIdx, "1", false);
        }
      });
    }

    function InitClientLogPageNum(totalPageNum) {
      var htmlTxt = "";
      for (var idx = 1; idx <= totalPageNum; ++idx) {
        var html =
          '<a style="color: red; font-weight: 700; text-decoration: underline;margin-left:3px;cursor:pointer;" href="##">' +
          idx +
          "</a>";
        htmlTxt += html;
      }
      document.getElementById("divClientLogPageNum").innerHTML = htmlTxt;

      $("#divClientLogPageNum").click(function (event) {
        if ($(event.target).is("a")) {
          $(event.target).css("color", "blue");
          $(event.target).addClass("pageSelIdx");
          $(event.target).siblings().css("color", "red");
          $(event.target).siblings().removeClass("pageSelIdx");
          var pageIdx = $(event.target).text();
          currentActiveClientPageIdx = pageIdx;
          $("#deleteAllClientLog").attr("checked", false);
          RefreshClientLogDeleteBtn(true);
          UpdateLogList(pageIdx, "0", false);
        }
      });
    }
    function AddDialLogToList(
      id,
      cid,
      startTime,
      endTime,
      ipType,
      ipAddr,
      ipv6Addr,
      pdpName
    ) {
      var logInfo =
        id +
        "$" +
        cid +
        "$" +
        startTime +
        "$" +
        endTime +
        "$" +
        ipType +
        "$" +
        ipAddr +
        "$" +
        ipv6Addr +
        "$" +
        pdpName +
        "$";

      var startTimeHtml, endTimeHtml, ipTypeHtml;
      var ipTypeHtml, ipAddrHtml, ipv6AddrHtml;

      if ("0" != startTime) {
        var arr = startTime.split(" ");
        startTimeHtml = arr[1] + "/" + arr[2] + "/" + arr[0] + " " + arr[3];
      }
      if ("0" != endTime) {
        var arr = endTime.split(" ");
        endTimeHtml = arr[1] + "/" + arr[2] + "/" + arr[0] + " " + arr[3];
      }

      ipTypeHtml = "Unkown";
      ipAddrHtml = ipAddr;
      ipv6AddrHtml = ipv6Addr;

      if (0 == ipType) {
        ipTypeHtml = "IPv4v6";
      } else if (1 == ipType) {
        ipTypeHtml = "IPv4";
        ipv6AddrHtml = "N/A";
      } else if (2 == ipType) {
        ipTypeHtml = "IPv6";
        ipAddrHtml = "N/A";
      }

      var htmlTxtNode =
        '<tr name="' +
        logInfo +
        '"><td class="pointer" style="text-align:center;"><span>' +
        pdpName +
        "</span></td>" +
        '<td style="text-align:center">' +
        cid +
        " </td>" +
        '<td style="text-align:center; padding: 5px 10px">' +
        startTimeHtml +
        " </td>" +
        '<td style="text-align:center">' +
        endTimeHtml +
        " </td>" +
        '<td style="text-align:center">' +
        ipTypeHtml +
        " </td>" +
        '<td style="text-align:center">' +
        ipAddrHtml +
        " </td>" +
        '<td style="text-align:center">' +
        ipv6AddrHtml +
        " </td>" +
        ' <td style="text-align:center;"><input class="delCheckBox" type="checkbox" id="' +
        id +
        '"></td></tr>';

      $("#DialLogList").append(htmlTxtNode);

      $(".delCheckBox:last").click(function () {
        if ($(".delCheckBox:checked").length == $(".delCheckBox").length) {
          $("#deleteAllDialLog").prop("checked", true);
        } else {
          $("#deleteAllDialLog").prop("checked", false);
        }
        if ($(".delCheckBox:checked").length >= 1) {
          RefreshDialLogDeleteBtn(false);
        } else {
          RefreshDialLogDeleteBtn(true);
        }
      });

      $("#deleteAllDialLog").click(function () {
        if ($(this).prop("checked")) {
          $(".delCheckBox").each(function () {
            $(this).prop("checked", true);
          });
          RefreshDialLogDeleteBtn(false);
        } else {
          $(".delCheckBox").each(function () {
            $(this).prop("checked", false);
          });
          RefreshDialLogDeleteBtn(true);
        }
      });
    }

    function AddClientLogToList(id, mac, conTime, disconTime) {
      var logInfo = id + "$" + mac + "$" + conTime + "$" + disconTime + "$";
      var conTimeHtml = "N/A";
      var disconTimeHtml = "N/A";

      if ("0" != conTime && "" != conTime) {
        var arr = conTime.split(" ");
        conTimeHtml = arr[1] + "/" + arr[2] + "/" + arr[0] + " " + arr[3];
      }
      if ("0" != disconTime && "" != disconTime) {
        var arr = disconTime.split(" ");
        disconTimeHtml = arr[1] + "/" + arr[2] + "/" + arr[0] + " " + arr[3];
      }

      var htmlTxtNode =
        '<tr name="' +
        logInfo +
        '"><td class="pointer" style="text-align:center;"><span>' +
        mac +
        "</span></td>" +
        '<td style="text-align:center; padding: 5px 10px">' +
        conTimeHtml +
        " </td>" +
        '<td style="text-align:center">' +
        disconTimeHtml +
        " </td>" +
        ' <td style="text-align:center;"><input class="delCheckBox1" type="checkbox" id="' +
        id +
        '"></td></tr>';

      $("#ClientLogList").append(htmlTxtNode);

      $(".delCheckBox1:last").click(function () {
        if ($(".delCheckBox1:checked").length == $(".delCheckBox1").length) {
          $("#deleteAllClientLog").prop("checked", true);
        } else {
          $("#deleteAllClientLog").prop("checked", false);
        }
        if ($(".delCheckBox1:checked").length >= 1) {
          RefreshClientLogDeleteBtn(false);
        } else {
          RefreshClientLogDeleteBtn(true);
        }
      });

      $("#deleteAllClientLog").click(function () {
        if ($(this).prop("checked")) {
          $(".delCheckBox1").each(function () {
            $(this).prop("checked", true);
          });
          RefreshClientLogDeleteBtn(false);
        } else {
          $(".delCheckBox1").each(function () {
            $(this).prop("checked", false);
          });
          RefreshClientLogDeleteBtn(true);
        }
      });
    }

    return this;
  };
})(jQuery);
function deleteAccessLog(obj) {
  var index = $(obj).attr("name");
  var jsonData = {};
  jsonData.delete_index = index;
  showWait();
  setTimeout(function () {
    postJSON("detailed_log", jsonData, function (data) {
      if (data.result != "success") {
        showMsgBox(
          jQuery.i18n.prop("mNetworkActivity"),
          jQuery.i18n.prop("dialog_message_network_activity_delete_fail")
        );
      } else {
        $.objNetworkActivity().onLoad(false);
      }
    });
  }, 100);
}
function deleteClientAccessLog(obj) {
  var index = $(obj).attr("name");
  var jsonData = {};
  jsonData.delete_con_time_index = index;
  setTimeout(function () {
    postJSON("detailed_log", jsonData, function (data) {
      if (data.result != "success") {
        showMsgBox(
          jQuery.i18n.prop("mNetworkActivity"),
          jQuery.i18n.prop("dialog_message_network_activity_delete_fail")
        );
      } else {
        $.objNetworkActivity().onLoad(false);
      }
    });
  }, 100);
}

// // -------------------------------------------------------------objPhoneBook-----------------------------------------------------------------
(function ($) {
  $.objPhoneBook = function () {
    var that = this;
    var PHONE_NUM_PER_PAGE = 10;
    var countNum = 1;
    var maxNum = 100;
    var delCount = 0;
    var pageCount = 10;
    var pageTotal = 1;
    var pageIndex = 1;
    var isAllChecked = false;
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.addPhoneBook();
        that.deleteSimPhoneBook();
        that.sendMessage();
        that.copyMove();
        that.btnEvent();
      }
      that.showData();
      setDlgStyle();
    };
    this.showData = function () {
      var deviceNum, SimNum;
      callJSON("phonebook", function (json) {
        deviceNum =
          jQuery.i18n.prop("mLocationContact") +
          "(" +
          json.pb_dev_used_record_num +
          "/" +
          json.pb_dev_max_record_num +
          ")";
        SimNum =
          "  " +
          jQuery.i18n.prop("mSimPhoneBook") +
          "(" +
          json.pb_sim_used_record_num +
          "/" +
          json.pb_sim_max_record_num +
          ")";
        if (json.pb_sim_max_record_num == "0") {
          SimNum = "  " + jQuery.i18n.prop("lUnknownNoSIM");
        }
        $("#lt_phonebook_DeviceSimNum").html(deviceNum + SimNum);
      });
      this.UpdatePhoneBookList(1, true);
    };
    this.btnEvent = function () {
      $("#selSaveLoc").unbind("change");
      $("#selSaveLoc").bind("change", function () {
        if ($("#selSaveLoc").val() == "0") {
          $("#divDeviceSupport").hide();
        } else {
          $("#divDeviceSupport").show();
        }
        setDlgStyle();
      });

      $("#lt_Phonebook_btnNew").unbind("click");
      $("#lt_Phonebook_btnNew").bind("click", function () {
        var pbGroup;
        switch (SubMenuId) {
          case "mAllContact":
            pbGroup = "all";
            break;
          case "mLoactionCommon":
            pbGroup = "common";
            break;
          case "mLoactionFamliy":
            pbGroup = "family";
            break;
          case "mLoactionFriends":
            pbGroup = "friend";
            break;
          case "mLoactionColleague":
            pbGroup = "colleague";
            break;
        }
        if ("mLoactionCommon" == SubMenuId || "mAllContact" == SubMenuId) {
          $("#selSaveLoc").val("0");
          // $("#selSaveLoc").attr("disabled", true);
          // $("#selSaveLoc").css("backgroundColor","#ddd");
          $("#divDeviceSupport").hide();
          $("#selGroup").val("common");
        } else {
          $("#selSaveLoc").val("1");
          // $("#selSaveLoc").attr("disabled", false);
          // $("#selSaveLoc").css("backgroundColor","#fff");
          $("#divDeviceSupport").show();
          $("#selGroup").val(pbGroup);
        }
        $("#lt_SimPhoneBook_btnUpdate").hide();
        $("#lt_SimPhoneBook_btnAdd").show();
        $("input[type='text']").val("");
        $("#lSimPhoneBookError").hide();
        $("#phoneInfoDlg").show();
        $("#selSaveLoc").attr("disabled", false);
        $("#selSaveLoc").css("backgroundColor", "#fff");
        setDlgStyle();
        setAddBoxHeigth("phoneInfoDlg");
      });

      $("#lt_SimPhoneBook_btnUpdate").unbind("click");
      $("#lt_SimPhoneBook_btnUpdate").bind("click", function () {
        if (that.checkInput()) {
          var stcName = UniEncode($("#txt_Phonebook_stcName").val());
          var stcNum = $("#txt_Phonebook_stcNum").val();
          var selLoc = $("#selSaveLoc").val();
          var selGroup = $("#selGroup").val();
          var email = UniEncode($("#txtEmail").val());
          var homePhone = $("#txtHomePhone").val();
          var officePhone = $("#txtOfficePhone").val();

          var jsonData = {};
          jsonData.pb_action = "pbm_contact_edit";
          jsonData.pb_edit_id = $("#lt_SimPhoneBook_btnUpdate").attr("name");
          jsonData.location = selLoc;
          jsonData.name = stcName;
          jsonData.mobile = stcNum;
          if (selLoc == "1") {
            jsonData.homenum = homePhone;
            jsonData.officephone = officePhone;
            jsonData.email = email;
            jsonData.group = selGroup;
          }
          showWait();
          setTimeout(function () {
            postJSON("phonebook", jsonData, function (data) {
              if (0 == data.pb_result || "0" == data.pb_result) {
                showMsgBox(
                  jQuery.i18n.prop("dialog_message_phonebook_title"),
                  jQuery.i18n.prop(
                    "dialog_message_phonebook_save_contact_success"
                  )
                );
                $("#phoneInfoDlg").hide();
                that.onLoad(false);
              } else {
                showMsgBox(
                  jQuery.i18n.prop("dialog_message_phonebook_title"),
                  jQuery.i18n.prop("dialog_message_phonebook_save_contact_fail")
                );
              }
            });
          }, 100);
        }
      });

      $("#addPhoneBookBoxclose").unbind("click");
      $("#addPhoneBookBoxclose").bind("click", function () {
        $("#phoneInfoDlg").hide();
      });

      $("#lt_SimPhoneBook_btnCancel").unbind("click");
      $("#lt_SimPhoneBook_btnCancel").bind("click", function () {
        $("#phoneInfoDlg").hide();
      });

      $("#lt_copyMove_btnCancel").unbind("click");
      $("#lt_copyMove_btnCancel").bind("click", function () {
        $("#copyMoveDlg").hide();
      });
      $("#copyMoveBoxclose").unbind("click");
      $("#copyMoveBoxclose").bind("click", function () {
        $("#copyMoveDlg").hide();
      });

      $("#lt_sendMessage_btnCancel").unbind("click");
      $("#lt_sendMessage_btnCancel").bind("click", function () {
        $("#sendMessageDlg").hide();
      });
      $("#sendMessageBoxclose").unbind("click");
      $("#sendMessageBoxclose").bind("click", function () {
        $("#sendMessageDlg").hide();
      });

      var bind_name = "input";
      if (navigator.userAgent.indexOf("MSIE") != -1) {
        bind_name = "propertychange";
      }
      $("#txtSmsContentInPhoneBook").unbind(bind_name);
      $("#txtSmsContentInPhoneBook").bind(bind_name, function () {
        $("#lt_phonebook_stcSmsErrorInfo").hide();
        var messageBody = $("#txtSmsContentInPhoneBook").val();
        var patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;

        var msgLen = messageBody.length;
        var charCount, itemCount;
        if (!IsGSM7Code(messageBody)) {
          if (msgLen > 335) {
            $("#lt_phonebook_stcSmsErrorInfo").text(
              jQuery.i18n.prop("lt_sms_stcSmsLenghtError")
            );
            $("#lt_phonebook_stcSmsErrorInfo").show();
            $("#txtSmsContentInPhoneBook").val(messageBody.substr(0, 335));
            msgLen = 335;
          }
          charCount = "(" + msgLen + "/335)";
          if (msgLen <= 70) {
            itemCount = 1;
          } else {
            itemCount = Math.floor(msgLen / 67 + (msgLen % 67 > 0 ? 1 : 0));
          }
        } else {
          //english
          if (msgLen > 765) {
            $("#lt_phonebook_stcSmsErrorInfo").text(
              jQuery.i18n.prop("lt_sms_stcSmsLenghtError")
            );
            $("#lt_phonebook_stcSmsErrorInfo").show();
            $("#txtSmsContentInPhoneBook").val(messageBody.substr(0, 765));
            msgLen = 765;
          }
          var specString = "^{}\\[]~|";
          for (var idx = 0; idx < messageBody.length; ++idx) {
            if (-1 != specString.indexOf(messageBody[idx])) {
              ++msgLen;
            }
          }
          if (msgLen <= 160) {
            itemCount = 1;
          } else {
            if (-1 != specString.indexOf(messageBody[152])) {
              ++msgLen;
            }
            itemCount = Math.floor(msgLen / 153 + (msgLen % 153 > 0 ? 1 : 0));
          }
          charCount = "(" + msgLen + "/765)";
        }
        $("#inputcountInPhoneBook").text(charCount);
        $("#inputItemCountInPhoneBook").text("(" + itemCount + "/5)");
      });
    };
    this.UpdatePhoneBookList = function (pageNumber, bInitFlag) {
      var pbGroup;
      switch (SubMenuId) {
        case "mAllContact":
          pbGroup = "all";
          break;
        case "mLoactionCommon":
          pbGroup = "common";
          break;
        case "mLoactionFamliy":
          pbGroup = "family";
          break;
        case "mLoactionFriends":
          pbGroup = "friend";
          break;
        case "mLoactionColleague":
          pbGroup = "colleague";
          break;
        default:
      }

      var jsonData = {};
      if ("mAllContact" == SubMenuId) {
        jsonData.pb_action = "pb_get_all";
      } else {
        jsonData.pb_action = "pb_get_by_gr";
        jsonData.pb_gr = pbGroup;
      }
      jsonData.location = "2";
      jsonData.page_num = "" + pageNumber;
      jsonData.data_per_page = "" + PHONE_NUM_PER_PAGE;
      postJSON("phonebook", jsonData, function (json) {
        var showHTML = "";
        var strGroup, locImage;
        for (var i = 0; i < json.Item.length; i++) {
          var l = json.Item[i];
          var pbmId = l.pbm_id;
          var pbmLocation = l.pbm_location;
          var pbmName = UniDecode(l.pbm_name);
          var pbmNumber = l.pbm_number;
          var pbmHomeNum = l.pbm_anr;
          var pbmOfficeNum = l.pbm_anr1;
          var pbmEmail = l.pbm_email;
          var pbmNickName = l.pbm_sne;
          var pbmGroup = l.pbm_group;
          if ("NONE" == pbmHomeNum) {
            pbmHomeNum = "";
          }
          if ("NONE" == pbmOfficeNum) {
            pbmOfficeNum = "";
          }
          if ("NONE" == pbmEmail) pbmEmail = "";
          else pbmEmail = UniDecode(l.pbm_email);
          if ("NONE" == pbmNickName) pbmNickName = "";
          else pbmNickName = UniDecode(l.pbm_sne);

          if (1 == pbmLocation) {
            locImage = "images/device.png";
          } else {
            locImage = "images/sim.png";
          }
          if ("friend" == pbmGroup)
            strGroup = jQuery.i18n.prop("mLoactionFriends");
          else if ("family" == pbmGroup)
            strGroup = jQuery.i18n.prop("mLoactionFamliy");
          else if ("common" == pbmGroup)
            strGroup = jQuery.i18n.prop("mLoactionCommon");
          else if ("colleague" == pbmGroup)
            strGroup = jQuery.i18n.prop("mLoactionColleague");
          var attrName =
            pbmId +
            "*&*" +
            pbmLocation +
            "*&*" +
            pbmName +
            "*&*" +
            pbmNumber +
            "*&*" +
            pbmHomeNum +
            "*&*" +
            pbmOfficeNum +
            "*&*" +
            pbmEmail +
            "*&*" +
            pbmGroup;

          showHTML +=
            '<tr><td name="' +
            attrName +
            '" onclick="showPhoneBookIndex(this)" sytle="cursor:pointer;">' +
            pbmName +
            "</td><td>" +
            pbmNumber +
            "</td><td>" +
            strGroup +
            '</td><td><img style="cursor:pointer;" onclick="phoneBookSendSms(this)" name="' +
            attrName +
            '" src="images/unread.png" /><img style="cursor:pointer;margin-left:20px;" name="' +
            pbmId +
            "*&*" +
            pbmLocation +
            '" onclick="CopyMovePhone(this)" src="' +
            locImage +
            '" /></td><td><input class="SimPhoneBook_del" name="' +
            pbmId +
            '" type="checkbox"/></td></tr>';
        }
        if (showHTML == "") {
          showHTML =
            '<tr><td colspan="5">' +
            jQuery.i18n.prop("lPBRetNoConactErr") +
            "</td></tr>";
          $("#tablePhoneBookBody").html(showHTML);
          $("#deleteAllPhone").prop("disabled", true);
        } else {
          $("#tablePhoneBookBody").html(showHTML);
          $("#deleteAllPhone").prop("disabled", false);
          that.showDeleteBtn();
        }
        if (bInitFlag) {
          pageTotal = parseInt(json.total_page_num);
          that.showPhoneBookPageNum();
        }
      });
    };
    this.showPhoneBookPageNum = function () {
      var htmlTxt = "";
      for (var i = 1; i <= pageTotal; i++) {
        htmlTxt +=
          '<a style="color: #555; font-weight: 700;text-decoration:none; margin:5px 3px;cursor:pointer;" name="' +
          i +
          '" href="##">' +
          i +
          "</a>";
      }
      $("#divPhoneBookPageNum").html(htmlTxt);
      $("#divPhoneBookPageNum a:first").css("color", "#05bda1");

      $("#divPhoneBookPageNum a").unbind("click");
      $("#divPhoneBookPageNum a").bind("click", function () {
        showWait();
        $("#divPhoneBookPageNum a").removeClass("pageSelIdx");
        $("#divPhoneBookPageNum a").css("color", "#555");
        $(this).css("color", "#05bda1");
        $(this).addClass("pageSelIdx");
        var PBPageIdx = $(this).attr("name");
        pageIndex = parseInt(PBPageIdx);
        $("#deleteAllPhone").prop("checked", false);
        $("#lt_Phonebook_btnDelete").hide();
        that.UpdatePhoneBookList(pageIndex, false);
      });
    };
    this.showDeleteBtn = function () {
      $("#lt_Phonebook_btnDelete").hide();
      $("#deleteAllPhone").prop("checked", false);

      $("#deleteAllPhone").unbind("click");
      $("#deleteAllPhone").bind("click", function () {
        if ($("#deleteAllPhone").is(":checked")) {
          if ($("#tablePhoneBookBody").html() != "") {
            $("#tablePhoneBookBody .SimPhoneBook_del").prop("checked", true);
            $("#lt_Phonebook_btnDelete").show();
          }
        } else {
          $("#tablePhoneBookBody .SimPhoneBook_del").prop("checked", false);
          $("#lt_Phonebook_btnDelete").hide();
        }
      });
      $("#tablePhoneBookBody .SimPhoneBook_del").each(function () {
        $(this).unbind("click");
        $(this).bind("click", function () {
          isAllChecked = true;
          $("#lt_Phonebook_btnDelete").hide();
          $("#tablePhoneBookBody .SimPhoneBook_del").each(function (index) {
            if ($(this).is(":checked")) {
              $("#lt_Phonebook_btnDelete").show();
            } else {
              isAllChecked = false;
            }
          });
          if (isAllChecked) {
            $("#deleteAllPhone").prop("checked", true);
          } else {
            $("#deleteAllPhone").prop("checked", false);
          }
        });
      });
    };
    this.copyMove = function () {
      $("#lt_copyMove_btnSave").unbind("click");
      $("#lt_copyMove_btnSave").bind("click", function () {
        var pbAction;
        if ($("#radio_move").is(":checked")) {
          if (
            $("#span_move").html() ==
            jQuery.i18n.prop("lt_Phonebook_moveToDevice")
          ) {
            pbAction = "PB_MV_SIM_TO_LOCAL";
          } else {
            pbAction = "PB_MV_LOCAL_TO_SIM";
          }
        } else {
          if (
            $("#span_copy").html() ==
            jQuery.i18n.prop("lt_Phonebook_copyToDevice")
          ) {
            pbAction = "PB_CP_SIM_TO_LOCAL";
          } else {
            pbAction = "PB_CP_LOCAL_TO_SIM";
          }
        }
        var pbId = $("#lt_copyMove_btnSave").attr("name") + ",";
        var jsonData = {};
        jsonData.pb_action = pbAction;
        jsonData.mv_cp_id = pbId;
        showWait();
        setTimeout(function () {
          postJSON("phonebook", jsonData, function (data) {
            if ("0" == data.pb_result) {
              $("#copyMoveDlg").hide();
              that.onLoad(false);
            } else {
              showMsgBox(
                jQuery.i18n.prop("dialog_message_phonebook_title"),
                jQuery.i18n.prop("lCopyFailed")
              );
            }
          });
        }, 100);
      });
    };
    this.addPhoneBook = function () {
      $("#lt_SimPhoneBook_btnAdd").unbind("click");
      $("#lt_SimPhoneBook_btnAdd").bind("click", function () {
        if (that.checkInput()) {
          var stcName = UniEncode($("#txt_Phonebook_stcName").val());
          var stcNum = $("#txt_Phonebook_stcNum").val();
          var selLoc = $("#selSaveLoc").val();
          var selGroup = $("#selGroup").val();
          var email = UniEncode($("#txtEmail").val());
          var homePhone = $("#txtHomePhone").val();
          var officePhone = $("#txtOfficePhone").val();

          var jsonData = {};
          jsonData.pb_action = "pbm_contact_add";
          jsonData.location = selLoc;
          jsonData.name = stcName;
          jsonData.mobile = stcNum;
          if (selLoc == "1") {
            jsonData.homenum = homePhone;
            jsonData.officephone = officePhone;
            jsonData.email = email;
            jsonData.group = selGroup;
          }
          showWait();
          setTimeout(function () {
            postJSON("phonebook", jsonData, function (data) {
              if (0 == data.pb_result || "0" == data.pb_result) {
                showMsgBox(
                  jQuery.i18n.prop("dialog_message_phonebook_title"),
                  jQuery.i18n.prop(
                    "dialog_message_phonebook_save_contact_success"
                  )
                );
                $("#phoneInfoDlg").hide();
                that.onLoad(false);
              } else {
                showMsgBox(
                  jQuery.i18n.prop("dialog_message_phonebook_title"),
                  jQuery.i18n.prop("dialog_message_phonebook_save_contact_fail")
                );
              }
            });
          }, 100);
        }
      });
    };
    this.sendMessage = function () {
      $("#lt_sendMessage_btnSend").unbind("click");
      $("#lt_sendMessage_btnSend").bind("click", function () {
        var phoneNumber = $("#txt_sendMessage_mobile").val();
        var text = $("#txtSmsContentInPhoneBook").val();
        var jsonData = {};
        var encodeType = "UNICODE";
        if (IsGSM7Code(text)) {
          encodeType = "GSM7_default";
        }

        jsonData.send_from_draft_id = "";
        jsonData.message_flag = "SEND_SMS";
        jsonData.sms_cmd = "4";
        jsonData.contacts = phoneNumber;
        jsonData.content = UniEncode(text);
        jsonData.encode_type = encodeType;
        jsonData.sms_time = GetSmsTime();
        showWait();
        setTimeout(function () {
          postJSON("message", jsonData, function (data) {
            if (data.sms_cmd_status_result != 3) {
              showMsgBox(
                jQuery.i18n.prop("dialog_message_phonebook_title"),
                jQuery.i18n.prop("lSaveMessageFailed")
              );
            } else {
              $("#sendMessageDlg").hide();
              that.onLoad(false);
            }
          });
        }, 100);
      });
    };
    this.checkInput = function () {
      $("#lSimPhoneBookError").hide();
      var stcName = $("#txt_Phonebook_stcName").val();
      var stcNum = $("#txt_Phonebook_stcNum").val();
      var selLoc = $("#selSaveLoc").val();
      var email = $("#txtEmail").val();
      var homePhone = $("#txtHomePhone").val();
      var officePhone = $("#txtOfficePhone").val();

      if (stcName.length == 0) {
        $("#lSimPhoneBookError").text(jQuery.i18n.prop("lNameEmpty"));
        $("#lSimPhoneBookError").show();
        return false;
      }
      if (!deviceNameValidation_Contain_Chinese(stcName)) {
        $("#lSimPhoneBookError").text(jQuery.i18n.prop("InvalidName"));
        $("#lSimPhoneBookError").show();
        return false;
      }
      if ("" == stcNum) {
        $("#lSimPhoneBookError").text(jQuery.i18n.prop("lMobilePhoneEmpty"));
        $("#lSimPhoneBookError").show();
        return false;
      }
      if (!IsPhoneNumber(stcNum)) {
        $("#lSimPhoneBookError").text(jQuery.i18n.prop("lMobilePhoneError"));
        $("#lSimPhoneBookError").show();
        return false;
      }
      if (selLoc == "1") {
        if ("" != email && !IsEmail(email)) {
          $("#lSimPhoneBookError").text(jQuery.i18n.prop("lEmailAddrError"));
          $("#lSimPhoneBookError").show();
          return false;
        }

        if ("" != homePhone && !IsPhoneNumber(homePhone)) {
          $("#lSimPhoneBookError").text(jQuery.i18n.prop("lHomePhoneError"));
          $("#lSimPhoneBookError").show();
          return false;
        }

        if ("" != officePhone && !IsPhoneNumber(officePhone)) {
          $("#lSimPhoneBookError").text(jQuery.i18n.prop("lOfficePhoneError"));
          $("#lSimPhoneBookError").show();
          return false;
        }
      }
      return true;
    };
    this.deleteSimPhoneBook = function () {
      $("#lt_Phonebook_btnDelete").unbind("click");
      $("#lt_Phonebook_btnDelete").bind("click", function () {
        var delId = "";
        $("#tablePhoneBookBody .SimPhoneBook_del").each(function () {
          if ($(this).is(":checked")) {
            delId = delId + $(this).attr("name") + ",";
          }
        });
        showWait();
        setTimeout(function () {
          var jsonData = {};
          jsonData.pb_action = "pbm_contact_delete";
          jsonData.location = "2";
          jsonData.delete_option = "delete_num";
          jsonData.delete_pb_id = delId;
          jsonData.pb_gr = SubMenuId;
          postJSON("phonebook", jsonData, function (data) {
            if (0 == data.pb_result || "0" == data.pb_result) {
              showMsgBox(
                jQuery.i18n.prop("dialog_message_phonebook_title"),
                jQuery.i18n.prop(
                  "dialog_message_phonebook_delete_contact_success"
                )
              );
              that.onLoad(false);
            } else {
              showMsgBox(
                jQuery.i18n.prop("dialog_message_phonebook_title"),
                jQuery.i18n.prop("dialog_message_phonebook_delete_contact_fail")
              );
            }
          });
        }, 100);
      });
    };
    this.displayControls = function () {
      $("#h1_add_phonebook").html(jQuery.i18n.prop("lt_Phonebook_btnNew"));
      $("#lt_Phonebook_btnNew").val(jQuery.i18n.prop("lt_Phonebook_btnNew"));
      $("#lt_Phonebook_btnDelete").val(
        jQuery.i18n.prop("lt_Phonebook_btnDelete")
      );
      $("#lt_Phonebook_stcName").html(jQuery.i18n.prop("lt_Phonebook_stcName"));
      $("#lt_Phonebook_stcMobileNum").html(
        jQuery.i18n.prop("lt_Phonebook_stcMobileNum")
      );
      $("#lt_Phonebook_stcGroup").html(
        jQuery.i18n.prop("lt_Phonebook_stcGroup")
      );
      $("#lt_Phonebook_stcSaveLoc").html(
        jQuery.i18n.prop("lt_Phonebook_stcSaveLoc")
      );
      $("#lt_Phonebook_stcSimCard").html(
        jQuery.i18n.prop("lt_Phonebook_stcSimCard")
      );
      $("#lt_Phonebook_stcDevice").html(
        jQuery.i18n.prop("lt_Phonebook_stcDevice")
      );
      $("#lt_Phonebook_stcSaveLoc1").html(
        jQuery.i18n.prop("lt_Phonebook_stcSaveLoc")
      );
      $("#lt_Phonebook_stcName1").html(
        jQuery.i18n.prop("lt_Phonebook_stcName")
      );
      $("#lt_Phonebook_stcMobileNum1").html(
        jQuery.i18n.prop("lt_Phonebook_stcMobileNum")
      );
      $("#lt_SimPhoneBook_btnAdd").val(
        jQuery.i18n.prop("lt_Phonebook_btnNewSave")
      );
      $("#lt_SimPhoneBook_btnCancel").val(
        jQuery.i18n.prop("lt_Phonebook_stcCancelView")
      );
      $("#lt_Phonebook_stcFormTitle").html(
        jQuery.i18n.prop("lt_Phonebook_stcFormTitle")
      );
      $("#lt_Phonebook_stcGroup1").html(
        jQuery.i18n.prop("lt_Phonebook_stcGroup")
      );
      $("#lt_Phonebook_stcCommonPhoneBook").html(
        jQuery.i18n.prop("lt_Phonebook_stcCommonPhoneBook")
      );
      $("#lt_Phonebook_stcFamilyPhoneBook").html(
        jQuery.i18n.prop("lt_Phonebook_stcFamilyPhoneBook")
      );
      $("#lt_Phonebook_stcFriendPhoneBook").html(
        jQuery.i18n.prop("lt_Phonebook_stcFriendPhoneBook")
      );
      $("#lt_Phonebook_stcColleaguePhoneBook").html(
        jQuery.i18n.prop("lt_Phonebook_stcColleaguePhoneBook")
      );
      $("#lt_Phonebook_stcEmail").html(
        jQuery.i18n.prop("lt_Phonebook_stcEmail")
      );
      $("#lt_Phonebook_stcHomeNum").html(
        jQuery.i18n.prop("lt_Phonebook_stcHomeNum")
      );
      $("#lt_Phonebook_stcOfficeNum").html(
        jQuery.i18n.prop("lt_Phonebook_stcOfficeNum")
      );
      $("#lt_SimPhoneBook_btnUpdate").val(jQuery.i18n.prop("lt_btnSave"));
      $("#lt_copyMove_btnSave").val(jQuery.i18n.prop("lt_btnSave"));
      $("#lt_copyMove_btnCancel").val(jQuery.i18n.prop("lt_btnCancel"));
      $("#lt_Phonebook_copyMove").html(
        jQuery.i18n.prop("lt_Phonebook_stcBoxTitle")
      );
      $("#lt_sendMessage_btnSend").val(
        jQuery.i18n.prop("lt_Phonebook_btnSendMsg")
      );
      $("#lt_sendMessage_btnCancel").val(jQuery.i18n.prop("lt_btnCancel"));
      $("#lt_sendMessage_title").html(
        jQuery.i18n.prop("lt_Phonebook_stcFormTitle")
      );
      $("#lt_sendMessage_mobile").html(
        jQuery.i18n.prop("lt_Phonebook_stcContact")
      );
      $("#lt_sendMessage_content").html(
        jQuery.i18n.prop("lt_Phonebook_stcContents")
      );
    };
    return this;
  };
})(jQuery);
function showPhoneBookIndex(obj) {
  $("#lt_SimPhoneBook_btnUpdate").show();
  $("#lt_SimPhoneBook_btnAdd").hide();
  var pbStr = $(obj).attr("name");
  var pbArr = pbStr.split("*&*");
  $("#txt_Phonebook_stcName").val(pbArr[2]);
  $("#txt_Phonebook_stcNum").val(pbArr[3]);
  $("#selSaveLoc").val(pbArr[1]);
  $("#lt_SimPhoneBook_btnUpdate").attr("name", pbArr[0]);
  if (pbArr[1] == "0") {
    $("#divDeviceSupport").hide();
    // $("#selSaveLoc").attr("disabled",true);
    // $("#selSaveLoc").css("backgroundColor","#ddd");
  } else {
    $("#divDeviceSupport").show();
    // $("#selSaveLoc").attr("disabled",false);
    // $("#selSaveLoc").css("backgroundColor","#fff");
    $("#selGroup").val(pbArr[7]);
    if ("NONE" == pbArr[6]) pbArr[6] = "";
    $("#txtEmail").val(pbArr[6]);
    $("#txtHomePhone").val(pbArr[4]);
    $("#txtOfficePhone").val(pbArr[5]);
  }
  $("#phoneInfoDlg").show();
  setDlgStyle();
  setAddBoxHeigth("phoneInfoDlg");
  $("#selSaveLoc").attr("disabled", true);
  $("#selSaveLoc").css("backgroundColor", "#ddd");
}
function CopyMovePhone(obj) {
  var pbStr = $(obj).attr("name");
  var pbArr = pbStr.split("*&*");
  if (pbArr[1] == "0") {
    $("#span_move").html(jQuery.i18n.prop("lt_Phonebook_moveToDevice"));
    $("#span_copy").html(jQuery.i18n.prop("lt_Phonebook_copyToDevice"));
  } else {
    $("#span_move").html(jQuery.i18n.prop("lt_Phonebook_moveToSim"));
    $("#span_copy").html(jQuery.i18n.prop("lt_Phonebook_copyToSim"));
  }
  $("#lt_copyMove_btnSave").attr("name", pbArr[0]);
  $("#copyMoveDlg").show();
  setDlgStyle();
  setAddBoxHeigth("copyMoveDlg");
}
function phoneBookSendSms(obj) {
  var pbStr = $(obj).attr("name");
  var pbArr = pbStr.split("*&*");
  $("#inputcountInPhoneBook").text("(0/765)");
  $("#inputItemCountInPhoneBook").text("(0/5)");
  $("#lt_sendMessage_btnSend").attr("name", pbArr[3]);
  $("#txt_sendMessage_mobile").val(pbArr[3]);
  $("#txtSmsContentInPhoneBook").val("");
  $("#sendMessageDlg").show();
  setDlgStyle();
  setAddBoxHeigth("sendMessageDlg");
}
function deviceNameValidation_Contain_Chinese(str) {
  //  if (isChineseChar(str)) {
  //  return false;   }

  if (str.toString().indexOf("#") != -1) return false;
  else if (str.toString().indexOf(":") != -1) return false;
  else if (str.toString().indexOf(" ") != -1) return false;
  else if (str.toString().indexOf("&") != -1) return false;
  else if (str.toString().indexOf(";") != -1) return false;
  else if (str.toString().indexOf("~") != -1) return false;
  else if (str.toString().indexOf("|") != -1) return false;
  else if (str.toString().indexOf("<") != -1) return false;
  else if (str.toString().indexOf(">") != -1) return false;
  else if (str.toString().indexOf("$") != -1) return false;
  else if (str.toString().indexOf("%") != -1) return false;
  else if (str.toString().indexOf("^") != -1) return false;
  else if (str.toString().indexOf("!") != -1) return false;
  else if (str.toString().indexOf("@") != -1) return false;
  else if (str.toString().indexOf(",") != -1) return false;
  else if (str.toString().indexOf("*") != -1) return false;
  else if (str.toString().indexOf("\\") != -1) return false;
  else if (str.toString().indexOf("/") != -1) return false;
  else return true;
}
// -------------------------------------------------------------objSms-----------------------------------------------------------------
var phoneNumberList = null;
var message_list_json = null;
(function ($) {
  $.objSms = function () {
    var that = this;
    var memStore = "";
    var tags = "";
    var SMS_NUMBER_PAGE = "10";
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.btnEvent();
        that.sendSms();
        that.deleteSms();
        that.saveSms();
        that.copySms();
        that.moveSms();
      }
      that.showData();
      setDlgStyle();
    };
    this.showData = function () {
      callJSON("status1", function (json) {
        if (json.sim_status == "0" || json.sim_status == 0) {
          g_bSimCardExist = true;
        } else {
          g_bSimCardExist = false;
        }
        if (SubMenuId == "mSim") {
          if (g_bSimCardExist) {
            that.UpdateSmsList(1, true);
          } else {
            showMsgBox(
              jQuery.i18n.prop("lOperateMessageReportTitle"),
              jQuery.i18n.prop("lsmsSimCardAbsent")
            );
            return;
          }
        } else {
          that.UpdateSmsList(1, true);
        }
      });
    };
    this.UpdateSmsList = function (pageNumber, bInitFlag) {
      var messageFlag;
      switch (SubMenuId) {
        case "mDeviceInbox":
          messageFlag = "GET_RCV_SMS_LOCAL";
          memStore = "1";
          tags = "12";
          break;
        case "mSmsOutbox":
          messageFlag = "GET_SENT_SMS_LOCAL";
          memStore = "1";
          tags = "2";
          break;
        case "mSim":
          messageFlag = "GET_SIM_SMS";
          memStore = "0";
          break;
        case "mSmsDrafts":
          messageFlag = "GET_DRAFT_SMS";
          memStore = "2";
          tags = "2";
          break;
        default:
      }
      var jsonData = {};
      jsonData.message_flag = messageFlag;
      jsonData.page_number = pageNumber;
      jsonData.data_per_page = SMS_NUMBER_PAGE;
      postJSON("message", jsonData, function (json) {
        var smsPageNum = parseInt(json.total_number);
        if (bInitFlag) {
          callJSON("message", function (json1) {
            var smsNvTotal = parseInt(json1.sms_nv_total);
            var smsSimTotal = parseInt(json1.sms_sim_total);
            var smsSimNum = parseInt(json1.sms_sim_num);
            var smsNvRecvTotal = parseInt(json1.sms_nv_rev_total);
            var smsNvSendTotal = parseInt(json1.sms_nv_send_total);
            var smsNvDraftTotal = parseInt(json1.sms_nv_draftbox_total);
            var smsNvRecvNum = parseInt(json1.sms_nv_rev_num);
            var smsNvSendNum = parseInt(json1.sms_nv_send_num);
            var smsNvDraftNum = parseInt(json1.sms_nv_draftbox_num);

            if (SubMenuId == "mDeviceInbox" && smsNvRecvNum >= smsNvRecvTotal) {
              showMsgBox(
                jQuery.i18n.prop("lsmsWarning"),
                jQuery.i18n.prop("lDeviceInboxCapacityFull")
              );
            }

            if (SubMenuId == "mSmsOutbox" && smsNvSendNum >= smsNvSendTotal) {
              showMsgBox(
                jQuery.i18n.prop("lsmsWarning"),
                jQuery.i18n.prop("lDeviceOutboxCapacityFull")
              );
            }

            if (SubMenuId == "mSmsDrafts" && smsNvDraftNum >= smsNvDraftTotal) {
              showMsgBox(
                jQuery.i18n.prop("lsmsWarning"),
                jQuery.i18n.prop("lDeviceDraftboxCapacityFull")
              );
            }

            if (SubMenuId == "mSim" && smsSimNum >= smsSimTotal) {
              showMsgBox(
                jQuery.i18n.prop("lsmsWarning"),
                jQuery.i18n.prop("lSimCardCapacityFull")
              );
            }

            that.InitSmsPageNum(smsPageNum);
            switch (SubMenuId) {
              case "mDeviceInbox":
                $("#lt_sms_stcTitle").html(
                  jQuery.i18n.prop(SubMenuId) +
                    "(" +
                    smsNvRecvNum +
                    "/" +
                    smsNvRecvTotal +
                    ")"
                );
                break;
              case "mSmsOutbox":
                $("#lt_sms_stcTitle").html(
                  jQuery.i18n.prop(SubMenuId) +
                    "(" +
                    smsNvSendNum +
                    "/" +
                    smsNvSendTotal +
                    ")"
                );
                break;
              case "mSim":
                $("#lt_sms_stcTitle").html(
                  jQuery.i18n.prop(SubMenuId) +
                    "(" +
                    smsSimNum +
                    "/" +
                    smsSimTotal +
                    ")"
                );
                break;
              case "mSmsDrafts":
                $("#lt_sms_stcTitle").html(
                  jQuery.i18n.prop(SubMenuId) +
                    "(" +
                    smsNvDraftNum +
                    "/" +
                    smsNvDraftTotal +
                    ")"
                );
                break;
              default:
            }
          });
        }
        $("#smsListInfo").html("");
        if (json.Item.length > 0) {
          for (var i = 0; i < json.Item.length; i++) {
            var l = json.Item[i];
            var status = l.status;
            var subjectUnicode = l.subject;
            var content = UniDecode(subjectUnicode);
            var from = UniDecode(l.from);
            var recvTime = l.received;
            var date = [];
            date = recvTime.split(",");
            var len = date.length;
            for (var j = 0; j < len - 1; j++) {
              //the last one is timezone , no need to handle
              if (date[j] < 10 && date[j].length < 2)
                // add 0 if number is smaller than 10
                date[j] = "0" + date[j];
            }
            var messageType = l.message_type;
            var formatTime =
              date[0] +
              "/" +
              date[1] +
              "/" +
              date[2] +
              " " +
              date[3] +
              ":" +
              date[4] +
              ":" +
              date[5]; //month/day/year hh:mm:ss
            that.AddSmsToList(
              from,
              content,
              subjectUnicode,
              formatTime,
              status,
              l.index,
              messageType
            );
          }
          that.checkboxAll();
          $("#deleteAllSms").attr("disabled", false);
          $("#deleteAllSms").attr("checked", false);
        } else {
          var noSMSHtml =
            '<tr><td colspan="5">' +
            jQuery.i18n.prop("lt_no_sms") +
            "</td></tr>";
          $("#smsListInfo").html(noSMSHtml);
          $("#deleteAllSms").attr("disabled", true);
          $("#deleteAllSms").attr("checked", false);
        }
      });
    };
    this.AddSmsToList = function (
      From,
      Subject,
      SubjectUniCode,
      recvTime,
      Status,
      id,
      messageType
    ) {
      var showSubject = Subject;
      if (Subject.length > 40) {
        showSubject = Subject.substr(0, 35) + "...";
      }
      showSubject = showSubject.replace(/</gi, "&lt");
      showSubject = showSubject.replace(/>/gi, "&gt");
      showSubject = showSubject.replace(/[ ]/g, "&nbsp");

      var contact = "";
      if (From.indexOf(";") == 0) {
        contact = From.substr(1, From.length - 1);
      } else {
        contact = From.substr(From.indexOf(";") + 1, From.length);
      }
      var statusLtTipId = "";
      var imgSrc = "";
      switch (Status) {
        case "0":
          statusLtTipId = "lt_sms_unreadSms";
          imgSrc = "unreadSms.png";
          break;
        case "1":
          statusLtTipId = "lt_sms_readedSms";
          imgSrc = "readedSms.png";
          break;
        case "2":
          statusLtTipId = "lt_sms_sendFailed";
          imgSrc = "SmssendFailed.png";
          break;
        case "3":
          statusLtTipId = "lt_sms_sendSuccess";
          imgSrc = "SendSmsSuccess.png";
          break;
        case "4":
          statusLtTipId = "lt_sms_drafts";
          imgSrc = "drafts.png";
          break;
        default:
          break;
      }
      var htmlText;
      if (0 == messageType) {
        htmlText =
          '<tr id="' +
          id +
          '" name="' +
          SubjectUniCode +
          '"><td>' +
          contact +
          '</td><td style="cursor: pointer;" onclick="showLocalSms(this)" value="' +
          SubjectUniCode +
          '" name="' +
          id +
          "*#*" +
          contact +
          "*#*" +
          '"><span>' +
          showSubject +
          "</span></td>" +
          "<td>" +
          recvTime +
          '</td><td> <img align="middle" src="images/' +
          imgSrc +
          '" title="' +
          jQuery.i18n.prop(statusLtTipId) +
          '"/></td>' +
          '<td><input id="' +
          id +
          '"  align="right" type="checkbox" class="del_checkbox"/></td></tr>';
      } else {
        htmlText =
          '<tr id="' +
          id +
          '" name="' +
          SubjectUniCode +
          '"><td name="' +
          From +
          '">' +
          contact +
          '</td><td style="background:#ddd;cursor: pointer;" value="' +
          SubjectUniCode +
          '" onclick="showLocalSms(this)" name="' +
          id +
          "*#*" +
          contact +
          "*#*" +
          '">' +
          showSubject +
          "</td>" +
          "<td><span>" +
          recvTime +
          '</span></td><td> <img align="middle" src="images/' +
          imgSrc +
          '" title="' +
          jQuery.i18n.prop(statusLtTipId) +
          '"/></td>' +
          '<td><input id="' +
          id +
          '"  align="right" type="checkbox" class="del_checkbox"/></td></tr>';
      }
      $("#smsListInfo").append(htmlText);
    };
    this.InitSmsPageNum = function (totalPageNum) {
      $("#divSmsPageNum").empty();
      totalPageNum = totalPageNum == 0 ? 1 : totalPageNum;
      for (var idx = 1; idx <= totalPageNum; ++idx) {
        var htmlTxt;
        if (idx == 1) {
          htmlTxt =
            '<a class="pageSelIdx" style="color: #05bda1; font-weight: 700; text-decoration: underline;margin-left:3px;cursor:pointer;" href="##">' +
            idx +
            "</a>";
        } else {
          htmlTxt =
            '<a style="color: #333; font-weight: 700; text-decoration: underline;margin-left:3px;cursor:pointer;" href="##">' +
            idx +
            "</a>";
        }
        $("#divSmsPageNum").append(htmlTxt);
      }
      $("#divSmsPageNum").unbind("click");
      $("#divSmsPageNum").bind("click", function (event) {
        if ($(event.target).is("a")) {
          $(event.target).css("color", "#05bda1");
          $(event.target).addClass("pageSelIdx");
          $(event.target).siblings().css("color", "#333");
          $(event.target).siblings().removeClass("pageSelIdx");
          var smsPageIdx = $(event.target).text();
          $("#deleteAllSms").attr("checked", false);
          that.UpdateSmsList(smsPageIdx, false);
        }
      });
    };
    this.deleteSms = function () {
      $("#lt_sms_btnDelete").unbind("click");
      $("#lt_sms_btnDelete").bind("click", function () {
        var deleteId = "";
        $(".del_checkbox").each(function (index) {
          if ($(this).is(":checked")) {
            deleteId += $(this).parent().parent().attr("id") + ",";
          }
        });
        var jsonData = {};
        jsonData.message_flag = "DELETE_SMS";
        jsonData.sms_cmd = "6";
        jsonData.tags = tags;
        jsonData.mem_store = memStore;
        jsonData.delete_message_id = deleteId;
        showWait();
        setTimeout(function () {
          postJSON("message", jsonData, function (data) {
            if (data.sms_cmd_status_result != 3) {
              showMsgBox(
                jQuery.i18n.prop("lOperateMessageReportTitle"),
                jQuery.i18n.prop("lDeleteMessageFailed")
              );
            } else {
              that.onLoad(false);
            }
          });
        }, 100);
      });
    };
    this.checkSendSms = function (phoneNumberList, smsText) {
      $("#lt_sms_stcSmsErrorInfo").hide();
      if ("" == phoneNumberList || phoneNumberList.trim() == "") {
        document.getElementById("lt_sms_stcSmsErrorInfo").style.display =
          "inline";
        $("#lt_sms_stcSmsErrorInfo").text(jQuery.i18n.prop("lContactIsEmpty"));
        return false;
      }
      var regex = /^\;{1,40}$/;
      if (regex.test(phoneNumberList)) {
        document.getElementById("lt_sms_stcSmsErrorInfo").style.display =
          "inline";
        $("#lt_sms_stcSmsErrorInfo").text(jQuery.i18n.prop("lContactIsEmpty"));
        return false;
      }

      var phoneNumberArr = phoneNumberList.split(";");
      for (var i = 0; i < phoneNumberArr.length; i++) {
        var phoneNumber = phoneNumberArr[i];
        if (!IsPhoneNumber(phoneNumber)) {
          document.getElementById("lt_sms_stcSmsErrorInfo").style.display =
            "inline";
          $("#lt_sms_stcSmsErrorInfo").text(
            jQuery.i18n.prop("lPhoneNumberFormatError")
          );
          return false;
        }
      }
      if (smsText == "") {
        document.getElementById("lt_sms_stcSmsErrorInfo").style.display =
          "inline";
        $("#lt_sms_stcSmsErrorInfo").text(jQuery.i18n.prop("lSmsIsEmpty"));
        return false;
      }

      if (IsGSM7Code(smsText)) {
        if (smsText.length > 765) {
          $("#lt_sms_stcSmsErrorInfo").text(
            jQuery.i18n.prop("lt_sms_stcSmsLenghtError")
          );
          document.getElementById("lt_sms_stcSmsErrorInfo").style.display =
            "inline";
          return false;
        }
      } else {
        if (smsText.length > 335) {
          $("#lt_sms_stcSmsErrorInfo").text(
            jQuery.i18n.prop("lt_sms_stcSmsLenghtError")
          );
          document.getElementById("lt_sms_stcSmsErrorInfo").style.display =
            "inline";
          return false;
        }
      }
      return true;
    };
    this.sendSms = function () {
      $("#lt_sms_btnSend").unbind("click");
      $("#lt_sms_btnSend").bind("click", function () {
        if (!g_bSimCardExist) {
          showMsgBox(
            jQuery.i18n.prop("lOperateMessageReportTitle"),
            jQuery.i18n.prop("lsmsSimCardAbsent")
          );
          return;
        }
        var phoneNumberList = $("#txtNumberList").val();
        var text = $("#txtSmsContent").val();
        if (that.checkSendSms(phoneNumberList, text)) {
          var encodeType = "UNICODE";
          if (IsGSM7Code(text)) {
            encodeType = "GSM7_default";
          }

          var smsId = "";
          if (SubMenuId == "mSmsDrafts") {
            smsId = $("#txtSmsContent").attr("name") + ",";
          }
          var phoneNumberArr = phoneNumberList.split(";");
          var jsonData = {};
          jsonData.send_from_draft_id = smsId;
          jsonData.message_flag = "SEND_SMS";
          jsonData.sms_cmd = "4";
          jsonData.contacts = phoneNumberArr.join(",") + ",";
          jsonData.content = UniEncode(text);
          jsonData.encode_type = encodeType;
          jsonData.sms_time = GetSmsTime();
          showWait();
          setTimeout(function () {
            postJSON("message", jsonData, function (data) {
              if (data.sms_cmd_status_result != 3) {
                showMsgBox(
                  jQuery.i18n.prop("lOperateMessageReportTitle"),
                  jQuery.i18n.prop("lSendMessageFailed")
                );
              } else {
                $("#divSmsList").show();
                $("#divSmsChatRoom").hide();
                that.onLoad(false);
              }
              if (data.status_report == "1") {
                QueryReportTryCount = 0;
                QuerySmsReport();
              }
            });
          }, 100);
        }
      });
    };
    this.saveSms = function () {
      $("#lt_sms_btnSaveDraft").unbind("click");
      $("#lt_sms_btnSaveDraft").bind("click", function () {
        var phoneNumberList = $("#txtNumberList").val();
        var text = $("#txtSmsContent").val();
        if (that.checkSendSms(phoneNumberList, text)) {
          phoneNumberList = phoneNumberList.split(";").join(",");
          var encodeType = "UNICODE";
          if (IsGSM7Code(text)) {
            encodeType = "GSM7_default";
          }
          if (
            ("UNICODE" == encodeType && text.length > 70) ||
            ("GSM7_default" == encodeType && text.length > 160)
          ) {
            document.getElementById("lt_sms_stcSmsErrorInfo").style.display =
              "inline";
            $("#lt_sms_stcSmsErrorInfo").text(
              jQuery.i18n.prop("lSaveSmsError")
            );
            return;
          }
          var smsId = "";
          if (SubMenuId == "mSmsDrafts") {
            smsId = $("#txtSmsContent").attr("name") + ",";
          }
          var jsonData = {};
          jsonData.message_flag = "SAVE_SMS";
          jsonData.sms_cmd = "5";
          jsonData.tags = "11";
          jsonData.mem_store = "1";
          jsonData.contacts = phoneNumberList;
          jsonData.content = UniEncode(text);
          jsonData.encode_type = encodeType;
          jsonData.sms_time = GetSmsTime();
          if (SubMenuId == "mSmsDrafts") {
            jsonData.edit_draft_id = smsId;
          }
          showWait();
          setTimeout(function () {
            postJSON("message", jsonData, function (data) {
              if (data.sms_cmd_status_result != 3) {
                showMsgBox(
                  jQuery.i18n.prop("lOperateMessageReportTitle"),
                  jQuery.i18n.prop("lSendMessageFailed")
                );
              } else {
                $("#divSmsList").show();
                $("#divSmsChatRoom").hide();
                that.onLoad(false);
              }
            });
          }, 100);
        }
      });
    };
    this.copySms = function () {
      $("#lt_sms_btnCopy").unbind("click");
      $("#lt_sms_btnCopy").bind("click", function () {
        if (
          SubMenuId == "mDeviceInbox" ||
          SubMenuId == "mSmsDrafts" ||
          SubMenuId == "mSmsOutbox"
        ) {
          if (!g_bSimCardExist) {
            showMsgBox(
              jQuery.i18n.prop("lOperateMessageReportTitle"),
              jQuery.i18n.prop("lsmsSimCardAbsent")
            );
            return;
          }
        }
        var copyId = "";
        $(".del_checkbox").each(function (index) {
          if ($(this).is(":checked")) {
            copyId += $(this).parent().parent().attr("id") + ",";
          }
        });
        var jsonData = {};
        if (
          SubMenuId == "mDeviceInbox" ||
          SubMenuId == "mSmsOutbox" ||
          SubMenuId == "mSmsDrafts"
        ) {
          jsonData.message_flag = "COPY_SMS_TO_SIM";
        } else {
          jsonData.message_flag = "COPY_SMS_TO_LOCAL";
        }
        jsonData.sms_cmd = "8";
        jsonData.tags = tags;
        jsonData.mem_store = memStore;
        jsonData.mv_cp_id = copyId;
        showWait();
        setTimeout(function () {
          postJSON("message", jsonData, function (data) {
            if (data.sms_cmd_status_result == "9" && smsCmd == "8") {
              showMsgBox(
                jQuery.i18n.prop("lOperateMessageReportTitle"),
                jQuery.i18n.prop("lCopyMessagePartialFailed")
              );
            } else if (data.sms_cmd_status_result != "3") {
              showMsgBox(
                jQuery.i18n.prop("lOperateMessageReportTitle"),
                jQuery.i18n.prop("lCopyMessageFailed")
              );
            } else {
              that.onLoad(false);
            }
          });
        }, 100);
      });
    };
    this.moveSms = function () {
      $("#lt_sms_btnMove").unbind("click");
      $("#lt_sms_btnMove").bind("click", function () {
        if (
          SubMenuId == "mDeviceInbox" ||
          SubMenuId == "mSmsDrafts" ||
          SubMenuId == "mSmsOutbox"
        ) {
          if (!g_bSimCardExist) {
            showMsgBox(
              jQuery.i18n.prop("lOperateMessageReportTitle"),
              jQuery.i18n.prop("lsmsSimCardAbsent")
            );
            return;
          }
        }
        var moveId = "";
        $(".del_checkbox").each(function (index) {
          if ($(this).is(":checked")) {
            moveId += $(this).parent().parent().attr("id") + ",";
          }
        });
        var jsonData = {};
        if (
          SubMenuId == "mDeviceInbox" ||
          SubMenuId == "mSmsOutbox" ||
          SubMenuId == "mSmsDrafts"
        ) {
          jsonData.message_flag = "MOVE_SMS_TO_SIM";
        } else {
          jsonData.message_flag = "MOVE_SMS_TO_LOCAL";
        }
        jsonData.sms_cmd = "9";
        jsonData.tags = tags;
        jsonData.mem_store = memStore;
        jsonData.mv_cp_id = moveId;
        showWait();
        setTimeout(function () {
          postJSON("message", jsonData, function (data) {
            if (data.sms_cmd_status_result == "9" && smsCmd == "9") {
              showMsgBox(
                jQuery.i18n.prop("lOperateMessageReportTitle"),
                jQuery.i18n.prop("lCopyMessagePartialFailed")
              );
            } else if (data.sms_cmd_status_result != "3") {
              showMsgBox(
                jQuery.i18n.prop("lOperateMessageReportTitle"),
                jQuery.i18n.prop("lCopyMessageFailed")
              );
            } else {
              that.onLoad(false);
            }
          });
        }, 100);
      });
    };
    this.btnEvent = function () {
      $("#lt_sms_btnNew").unbind("click");
      $("#lt_sms_btnNew").bind("click", function () {
        $("#txtNumberList").val("");
        $("#txtSmsContent").val("");
        $("#divSmsList").hide();
        $("#divRecvSmsContent").hide();
        $("#divSmsChatRoom").show();
      });

      $("#lt_sms_btnCancel").bind("click", function () {
        $("#txtSmsCharaNum").text("(0/765)");
        $("#txtSmsItemNum").text("(0/5)");
        $("#divSmsChatRoom").hide();
        $("#divSmsList").show();
        that.onLoad(false);
      });

      var bind_name = "input";
      if (navigator.userAgent.indexOf("MSIE") != -1) {
        bind_name = "propertychange";
      }
      $("#txtSmsContent").unbind(bind_name);
      $("#txtSmsContent").bind(bind_name, function () {
        valuateContLen();
      });

      $("#deleteAllSms").unbind("click");
      $("#deleteAllSms").bind("click", function () {
        if ($("#deleteAllSms").is(":checked")) {
          $("#smsListInfo input").prop("checked", true);
          if (
            SubMenuId == "mDeviceInbox" ||
            SubMenuId == "mSmsOutbox" ||
            SubMenuId == "mSmsDrafts"
          ) {
            $("#lt_sms_btnCopy").val(
              jQuery.i18n.prop("lt_sms_stcmeucopytosim")
            );
            $("#lt_sms_btnMove").val(
              jQuery.i18n.prop("lt_sms_stcmeumovetosim")
            );
          } else {
            $("#lt_sms_btnCopy").val(
              jQuery.i18n.prop("lt_sms_stcmeucopytolocal")
            );
            $("#lt_sms_btnMove").val(
              jQuery.i18n.prop("lt_sms_stcmeumovetolocal")
            );
          }

          $("#lt_sms_btnDelete").show();
          $("#lt_sms_btnCopy").show();
          $("#lt_sms_btnMove").show();
          if (SubMenuId == "mSmsDrafts" || SubMenuId == "mSmsOutbox") {
            $("#lt_sms_btnCopy").hide();
            $("#lt_sms_btnMove").hide();
          }
        } else {
          $("#smsListInfo .del_checkbox").prop("checked", false);
          $("#lt_sms_btnDelete").hide();
          $("#lt_sms_btnCopy").hide();
          $("#lt_sms_btnMove").hide();
        }
      });
    };
    this.checkboxAll = function () {
      $(".del_checkbox").unbind("click");
      $(".del_checkbox").bind("click", function () {
        var allChecked = true;
        var isChecked = false;
        $(".del_checkbox").each(function (index) {
          if (!$(this).is(":checked")) {
            allChecked = false;
          } else {
            isChecked = true;
          }
        });

        if (allChecked) {
          $("#deleteAllSms").prop("checked", true);
        } else {
          $("#deleteAllSms").prop("checked", false);
        }
        if (isChecked) {
          if (
            SubMenuId == "mDeviceInbox" ||
            SubMenuId == "mSmsOutbox" ||
            SubMenuId == "mSmsDrafts"
          ) {
            $("#lt_sms_btnCopy").val(
              jQuery.i18n.prop("lt_sms_stcmeucopytosim")
            );
            $("#lt_sms_btnMove").val(
              jQuery.i18n.prop("lt_sms_stcmeumovetosim")
            );
          } else {
            $("#lt_sms_btnCopy").val(
              jQuery.i18n.prop("lt_sms_stcmeucopytolocal")
            );
            $("#lt_sms_btnMove").val(
              jQuery.i18n.prop("lt_sms_stcmeumovetolocal")
            );
          }
          $("#lt_sms_btnDelete").show();
          $("#lt_sms_btnCopy").show();
          $("#lt_sms_btnMove").show();

          if (SubMenuId == "mSmsDrafts" || SubMenuId == "mSmsOutbox") {
            $("#lt_sms_btnCopy").hide();
            $("#lt_sms_btnMove").hide();
          }
        } else {
          $("#lt_sms_btnDelete").hide();
          $("#lt_sms_btnCopy").hide();
          $("#lt_sms_btnMove").hide();
        }
      });
    };
    this.readSMS = function (index) {
      var jsonData = {};
      jsonData.message_flag = "SET_MSG_READ";
      jsonData.sms_cmd = "7";
      jsonData.tags = tags;
      jsonData.mem_store = memStore;
      jsonData.read_message_id = index;
      postJSON("message", jsonData);
    };
    this.displayControls = function () {
      document.getElementById("lt_sms_stcFrom").innerHTML =
        jQuery.i18n.prop("lt_sms_stcFrom");
      document.getElementById("lt_sms_stcSubject").innerHTML =
        jQuery.i18n.prop("lt_sms_stcSubject");
      document.getElementById("lt_sms_stcRecvTime").innerHTML =
        jQuery.i18n.prop("lt_sms_stcRecvTime");
      document.getElementById("lt_sms_stcStatus").innerHTML =
        jQuery.i18n.prop("lt_sms_stcStatus");
      $("#lt_sms_btnSend").val(jQuery.i18n.prop("lt_sms_btnSend"));
      $("#lt_sms_btnDelete").val(jQuery.i18n.prop("lt_sms_btnDelete"));
      $("#lt_sms_btnNew").val(jQuery.i18n.prop("lt_sms_btnNew"));
      $("#lt_sms_btnSaveDraft").val(jQuery.i18n.prop("lt_sms_btnSaveDraft"));
      $("#lt_sms_btnCancel").val(jQuery.i18n.prop("lt_sms_btnCancel"));
      $("#lt_Phonebook_btnSave").val(jQuery.i18n.prop("lt_Phonebook_btnSave"));
      // $("#lt_sms_btnCopy").val(jQuery.i18n.prop("lt_sms_btnCopy"));
      // $("#lt_sms_btnMove").val(jQuery.i18n.prop("lt_sms_btnMove"));
    };
    return this;
  };
})(jQuery);
function showLocalSms(smsId) {
  var strSms = $(smsId).attr("name");
  var arr = strSms.split("*#*");
  var val = UniDecode($(smsId).attr("value"));
  $("#txtSmsContent").val("");
  $("#divSmsList").hide();
  $("#divSmsChatRoom").show();
  $("#lt_sms_btnSaveDraft").show();
  $("#lt_sms_btnSend").show();
  $("#txtNumberList").val(arr[1]);
  if (SubMenuId == "mSmsDrafts") {
    $("#divRecvSmsContent").hide();
    $("#txtSmsContent").val(val);
    $("#txtSmsContent").attr("name", arr[0]);
  } else {
    $("#txtRecvSmsContent").html(val);
    $("#divRecvSmsContent").show();
  }
  valuateContLen();
  $.objSms().readSMS(arr[0]);
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
function valuateContLen() {
  $("#lt_sms_stcSmsErrorInfo").hide();
  var messageBody = document.getElementById("txtSmsContent").value;
  // var patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;

  var msgLen = messageBody.length;
  var charCount, itemCount;
  if (!IsGSM7Code(messageBody)) {
    if (msgLen > 335) {
      $("#txtSmsContent").val(messageBody.substr(0, 335));
      msgLen = 335;
    }
    charCount = "(" + msgLen + "/335)";
    if (msgLen <= 70) {
      itemCount = 1;
    } else {
      itemCount = Math.floor(msgLen / 67 + (msgLen % 67 > 0 ? 1 : 0));
    }
  } else {
    //english
    if (msgLen > 765) {
      $("#txtSmsContent").val(messageBody.substr(0, 765));
      msgLen = 765;
    }

    if (msgLen <= 160) {
      itemCount = 1;
    } else {
      itemCount = Math.floor(msgLen / 153 + (msgLen % 153 > 0 ? 1 : 0));
    }

    charCount = "(" + msgLen + "/765)";
  }

  $("#txtSmsCharaNum").text(charCount);
  $("#txtSmsItemNum").text("(" + itemCount + "/5)");
}
var QueryReportTryCount = 0;
function QuerySmsReport() {
  var recvSuccessNumber = "";
  var recvFailNumber = "";
  callJSON("sms_getReportStatus", function (retData) {
    if (
      retData &&
      retData.sms_report_status_list.length == 0 &&
      ++QueryReportTryCount < 5
    ) {
      setTimeout(QuerySmsReport, 4000);
    } else if (retData && retData.sms_report_status_list.length > 0) {
      for (var i = 0; i < retData.sms_report_status_list.length; i++) {
        var l = retData.sms_report_status_list[i];
        var phoneNumber = l.submit_num;
        if ("1" == l.status) {
          recvSuccessNumber = recvSuccessNumber + phoneNumber + ";";
        } else {
          recvFailNumber = recvFailNumber + phoneNumber + ";";
        }
      }

      var msg = "";
      if (recvSuccessNumber && "" != recvSuccessNumber) {
        msg =
          msg +
          recvSuccessNumber.substr(0, recvSuccessNumber.length - 1) +
          " " +
          jQuery.i18n.prop("lMessageReportSuccessReceive");
      }
      if (recvFailNumber && "" != recvFailNumber) {
        msg =
          msg +
          recvFailNumber.substr(0, recvFailNumber.length - 1) +
          " " +
          jQuery.i18n.prop("lMessageReportFailedReceive");
      }
      showMsgBox(jQuery.i18n.prop("sms_send"), msg);
    }
  });
}
// -------------------------------------------------------------objSmsSet-----------------------------------------------------------------
(function ($) {
  $.objSmsSet = function () {
    var that = this;
    var savedSMSInfo = {};
    //var DefaultcenterNumber = "";
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.btnEvent();
      }
      that.showData();
      setDlgStyle();
    };
    this.showData = function () {
      callJSON("message", function (json) {
        savedSMSInfo = {};
        savedSMSInfo.sms_center = json.sms_center;
        savedSMSInfo.save_location = json.save_location;
        savedSMSInfo.sms_over_cs = json.sms_over_cs;
        savedSMSInfo.status_report = json.status_report;
        savedSMSInfo.save_time = json.save_time;
        $("#txtCenterNumber").val(json.sms_center);
        $("#smsSaveLocSel").val(json.save_location);
        $("#smsSMScsModeSel").val(json.sms_over_cs);
        //DefaultcenterNumber = json.sms_center;
        if (json.status_report == "0") {
          $("#SendReportDisabled").attr("checked", true);
        } else {
          $("#SendReportEnabled").attr("checked", true);
        }

        var saveTime = json.save_time;
        switch (saveTime) {
          case "143":
            $("#validitySel").get(0).selectedIndex = 0;
            break;
          case "167":
            $("#validitySel").get(0).selectedIndex = 1;
            break;
          case "173":
            $("#validitySel").get(0).selectedIndex = 2;
            break;
          case "255":
            $("#validitySel").get(0).selectedIndex = 3;
            break;
          default:
            $("#validitySel").get(0).selectedIndex = 0;
        }
      });
    };
    this.btnEvent = function () {
      /* $("#txtCenterNumber").unbind("change");
            $("#txtCenterNumber").bind("change",function(){
                var CurrentCenterNumber = $("#txtCenterNumber").val();
                if(CurrentCenterNumber!=DefaultcenterNumber){
                   // showMsgBox(jQuery.i18n.prop("mSmsSet"),jQuery.i18n.prop("lSMSCenterModificationWarning"));
				   showBOX2(jQuery.i18n.prop("mSmsSet"),jQuery.i18n.prop("lSMSCenterModificationWarning"),jQuery.i18n.prop("lt_btnConfirmYes"),jQuery.i18n.prop("lt_btnConfirmNo"),function(){
					  ClosemBOX2();  
				   },function(){
					    ClosemBOX2();
						$("#txtCenterNumber").val(DefaultcenterNumber) ;
				   });
                }
            }); */

      $("#lt_SmsSet_btnSave").unbind("click");
      $("#lt_SmsSet_btnSave").bind("click", function () {
        var sendval = $("#SendReportEnabled").is(":checked") ? "1" : "0";
        var centernum = $("#txtCenterNumber").val();
        var validityval = $("#validitySel").val();
        var smssaveval = $("#smsSaveLocSel").val();
        var smsModeval = $("#smsSMScsModeSel").val();

        if (
          centernum == savedSMSInfo.sms_center &&
          savedSMSInfo.save_location == smssaveval &&
          savedSMSInfo.sms_over_cs == smsModeval &&
          savedSMSInfo.status_report == sendval &&
          savedSMSInfo.save_time == validityval
        ) {
          return false;
        } else if (centernum == savedSMSInfo.sms_center) {
          that.saveSMSsetting(
            sendval,
            centernum,
            validityval,
            smssaveval,
            smsModeval
          );
        } else {
          if (that.validatePhoneNum(centernum)) {
            showBOX2(
              jQuery.i18n.prop("mSmsSet"),
              jQuery.i18n.prop("lSMSCenterModificationWarning"),
              jQuery.i18n.prop("lt_btnOK"),
              jQuery.i18n.prop("lt_btnCancel"),
              function () {
                ClosemBOX2();
                that.saveSMSsetting(
                  sendval,
                  centernum,
                  validityval,
                  smssaveval,
                  smsModeval
                );
              },
              function () {
                ClosemBOX2();
              }
            );
          }
        }
      });
    };

    this.saveSMSsetting = function (
      sendval,
      centernum,
      validityval,
      smssaveval,
      smsModeval
    ) {
      var jsonData = {};
      jsonData.message_flag = "SET_SMS_CENTER";
      jsonData.status_report = sendval;
      jsonData.sms_center = centernum;
      /* if(centernum!=DefaultcenterNumber){
					     jsonData.sms_center=centernum;
					 	}  */
      jsonData.save_time = validityval;
      jsonData.save_location = smssaveval;
      jsonData.sms_over_cs = smsModeval;
      showWait();
      setTimeout(function () {
        postJSON("message", jsonData, function (data) {
          that.onLoad(false);
        });
      }, 100);
    };

    this.validatePhoneNum = function (mobilePhone) {
      if (
        mobilePhone == "" ||
        mobilePhone.length > 15 ||
        mobilePhone.length < 3
      ) {
        $("#lt_sms_setting_error")
          .show()
          .text(
            jQuery.i18n.prop("dialog_message_sms_settings_title") +
              ":" +
              jQuery.i18n.prop("lphoneNumbertoolong")
          );
        return false;
      }
      if (!IsPhoneNumber(mobilePhone)) {
        $("#lt_sms_setting_error")
          .show()
          .text(
            jQuery.i18n.prop("dialog_message_sms_settings_title") +
              ":" +
              jQuery.i18n.prop("lMobilePhoneError")
          );
        return false;
      }
      return true;
    };
    this.displayControls = function () {
      $("#lt_SmsSet_stcTitle").html(jQuery.i18n.prop("mSmsSet"));
      $("#lt_SmsSet_stcDeliveryReport").html(
        jQuery.i18n.prop("lt_SmsSet_stcDeliveryReport")
      );
      $("#lt_SmsSet_stcSendReportEnabled").html(
        jQuery.i18n.prop("lt_SmsSet_stcSendReportEnabled")
      );
      $("#lt_SmsSet_stcSendReportDisabled").html(
        jQuery.i18n.prop("lt_SmsSet_stcSendReportDisabled")
      );
      $("#lt_SmsSet_stcSaveLoc").html(jQuery.i18n.prop("lt_SmsSet_stcSaveLoc"));
      $("#lt_SmsSet_stcSaveLocSimCard").html(
        jQuery.i18n.prop("lt_SmsSet_stcSaveLocSimCard")
      );
      $("#lt_SmsSet_stcSaveLocDevice").html(
        jQuery.i18n.prop("lt_SmsSet_stcSaveLocDevice")
      );
      $("#lt_SmsSet_stcSMSOverCSMode").html(
        jQuery.i18n.prop("lt_SmsSet_stcSMSOverCSMode")
      );
      $("#lt_SmsSet_stcPackageDomain").html(
        jQuery.i18n.prop("lt_SmsSet_stcPackageDomain")
      );
      $("#lt_SmsSet_stcCircuitSwitched").html(
        jQuery.i18n.prop("lt_SmsSet_stcCircuitSwitched")
      );
      $("#lt_SmsSet_stcValidity").html(
        jQuery.i18n.prop("lt_SmsSet_stcValidity")
      );
      $("#lt_SmsSet_stcTwelveHours").html(
        jQuery.i18n.prop("lt_SmsSet_stcTwelveHours")
      );
      $("#lt_SmsSet_stcOneDay").html(jQuery.i18n.prop("lt_SmsSet_stcOneDay"));
      $("#lt_SmsSet_stcOneWeek").html(jQuery.i18n.prop("lt_SmsSet_stcOneWeek"));
      $("#lt_SmsSet_stcLargest").html(jQuery.i18n.prop("lt_SmsSet_stcLargest"));
      $("#lt_SmsSet_stcCenterNumber").html(
        jQuery.i18n.prop("lt_SmsSet_stcCenterNumber")
      );
      $("#lt_SmsSet_btnSave").val(jQuery.i18n.prop("lt_SmsSet_btnSave"));
    };
    return this;
  };
})(jQuery);
// -------------------------------------------------------------objWifiSet-----------------------------------------------------------------
(function ($) {
  $.objWifiSet = function () {
    var that = this;
    var wifiPasswd;
    var quickset_StrCipher;
    var g_net_mode;
    var g_rfband;
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.wifiQuickSetup();
        that.wifiAdvanced();
        that.WifiOutoOff();
        that.btnEvent();
      }
      that.showData();
      setDlgStyle();
    };
    this.showData = function () {
      $("#wl_wifi_password").val("");
      callJSON("uapx_wlan_security_settings", function (json) {
        g_net_mode = json.net_mode;
        var ssid_status = json.ssid_bcast;
        if (ssid_status == "1") {
          $("#wl_advanced_status_radio_enable").prop("checked", true);
        } else {
          $("#wl_advanced_status_radio_disable").prop("checked", true);
        }
        var strSSID = json.ssid;
        $("#wl_nnSSID").val(UniDecode(strSSID));
        var _strSecurityType;
        var security_mode = json.mode;
        if (
          security_mode.length == 0 ||
          security_mode == null ||
          security_mode == ""
        ) {
          _strSecurityType = "None";
        } else {
          _strSecurityType = security_mode;
        }
        $("#wl_selectSecurityModeType").val(_strSecurityType);

        if (_strSecurityType != "None") {
          for (var i = 0; i < json.modeItem.length; i++) {
            if (json.modeItem[i].modeType == _strSecurityType) {
              wifiPasswd = json.modeItem[i].key;
              quickset_StrCipher = json.modeItem[i].mode;
              break;
            }
          }
          $("#wl_wifi_password").val(wifiPasswd);
          $("#td_wl_wifi_password").show();
          $("#wifi_password").show();
        } else {
          $("#td_wl_wifi_password").hide();
          $("#wifi_password").hide();
        }
      });
      callJSON("uapxb_wlan_basic_settings", function (json) {
        var last_channel = parseInt(json.last_channel);
        var optionHTML = "";
        for (var i = 0; i <= last_channel; i++) {
          if (i == 0) {
            optionHTML +=
              "<option id='dropdown_wireless_auto' value='0'>" +
              jQuery.i18n.prop("lt_wifiSet_optChannelAuto") +
              "</option>";
          } else {
            optionHTML +=
              "<option id='dropdown_CH" +
              i +
              "' value='" +
              i +
              "'>" +
              jQuery.i18n.prop("lt_wifiSet_optCH" + i) +
              "</option>";
          }
        }
        $("#wl_advanced_primary_channel_select").html(optionHTML);
        if (json.proto == "wifi") {
          $("#wl_advanced_primary_channel_select").attr("disabled", true);
          $("#wl_advanced_primary_channel_select").css(
            "backgroundColor",
            "#ddd"
          );
        } else {
          $("#wl_advanced_primary_channel_select").attr("disabled", false);
          $("#wl_advanced_primary_channel_select").css(
            "backgroundColor",
            "#fff"
          );
        }
        $("#wl_advanced_80211_mode_select").val(json.net_mode);
        $("#wl_advanced_primary_channel_select").val(json.channel);
        $("#wl_advanced_maximum_simultaneous_clients_select").val(
          json.max_clients
        );
        $("#wl_advanced_ap_isolate_select").val(json.ap_isolate);
        var wifiSleepTime = json.wifi_sleep_time;
        g_rfband = json.rf_band;
        if (wifiSleepTime == "0") {
          $("#wl_advanced_autooff_function_checkbox").attr("checked", true);
          $("#div_autoOff").hide();
        } else {
          $("#wl_advanced_autooff_function_checkbox").attr("checked", false);
          $("#wl_advanced_sleep_function_text").val(wifiSleepTime);
          $("#div_autoOff").show();
        }
        if (json.wlan_enable == "1") {
          $("#lt_radio_enable").prop("checked", true);
          $("#div_advanced").show();
        } else {
          $("#lt_radio_disable").prop("checked", true);
          $("#div_advanced").hide();
        }
      });
    };
    this.wifiAdvanced = function () {
      $("#btn_advanced_settings_apply").unbind("click");
      $("#btn_advanced_settings_apply").bind("click", function () {
        var netMode = $("#wl_advanced_80211_mode_select").val();
        var maxClients = $(
          "#wl_advanced_maximum_simultaneous_clients_select"
        ).val();
        var channelValue = $("#wl_advanced_primary_channel_select").val();
        var apIsolate = $("#wl_advanced_ap_isolate_select").val();
        var wlanEnable;
        if ($("#lt_radio_enable").is(":checked")) {
          wlanEnable = "1";
        } else {
          wlanEnable = "0";
        }
        var jsonData = {};
        jsonData.wlan_enable = wlanEnable;
        jsonData.rf_band = g_rfband;
        jsonData.net_mode = netMode;
        jsonData.channel = channelValue;
        jsonData.bandwidth = "1";
        jsonData.max_clients = maxClients;
        jsonData.ap_isolate = apIsolate;
        showWait();
        setTimeout(function () {
          postJSON("uapxb_wlan_basic_settings", jsonData, function (data) {
            if (data.result == "success") {
              showMsgBox(
                jQuery.i18n.prop("h_wireless_advanced_settings_title"),
                jQuery.i18n.prop(
                  "dialog_message_wifi_settings_modify_wifi_param_success"
                )
              );
              that.onLoad(false);
            } else {
              showMsgBox(
                jQuery.i18n.prop("h_wireless_advanced_settings_title"),
                jQuery.i18n.prop(
                  "dialog_message_wifi_settings_modify_wifi_param_fail"
                )
              );
            }
          });
        }, 100);
      });
    };
    this.WifiOutoOff = function () {
      $("#btn_autoOff_settings_apply").unbind("click");
      $("#btn_autoOff_settings_apply").bind("click", function () {
        $("#autoOff_error").hide();
        var sleepTime;
        if ($("#wl_advanced_autooff_function_checkbox").is(":checked")) {
          sleepTime = "0";
        } else {
          sleepTime = $("#wl_advanced_sleep_function_text").val();
        }
        if (!IsNumber(sleepTime)) {
          $("#autoOff_error").html(jQuery.i18n.prop("lSleepTimeErrorLogs"));
          $("#autoOff_error").show();
          return;
        }
        if ((sleepTime > 60 || sleepTime < 10) && sleepTime != 0) {
          $("#autoOff_error").html(jQuery.i18n.prop("lSleepTimeErrorLogs"));
          $("#autoOff_error").show();
          return;
        }

        var jsonData = {};
        jsonData.wifi_sleep_time = sleepTime;
        jsonData.wifi_sleep_action = "1";
        showWait();
        setTimeout(function () {
          postJSON("uapxb_wlan_basic_settings", jsonData, function (data) {
            if (data.result == "success") {
              showMsgBox(
                jQuery.i18n.prop("lWifiAutoOffFun"),
                jQuery.i18n.prop(
                  "dialog_message_wifi_settings_modify_wifi_param_success"
                )
              );
              that.onLoad(false);
            } else {
              showMsgBox(
                jQuery.i18n.prop("lWifiAutoOffFun"),
                jQuery.i18n.prop(
                  "dialog_message_wifi_settings_modify_wifi_param_fail"
                )
              );
            }
          });
        }, 100);
      });
    };
    this.btnEvent = function () {
      $("#showPawBox").click(function () {
        if ($(this).prop("checked")) {
          $("#wl_wifi_password").attr("type", "text");
        } else {
          $("#wl_wifi_password").attr("type", "password");
        }
      });

      $("#wl_selectSecurityModeType").unbind("change");
      $("#wl_selectSecurityModeType").bind("change", function () {
        if ($("#wl_selectSecurityModeType").val() == "None") {
          $("#td_wl_wifi_password").hide();
          $("#wifi_password").hide();
        } else {
          $("#td_wl_wifi_password").show();
          $("#wifi_password").show();
        }

        var _strSecurityType;
        var security_mode = $("#wl_selectSecurityModeType").val();
        if (
          security_mode.length == 0 ||
          security_mode == null ||
          security_mode == ""
        ) {
          _strSecurityType = "None";
        } else {
          _strSecurityType = security_mode;
        }
        callJSON("uapx_wlan_security_settings", function (json) {
          var pass = "";
          if (_strSecurityType != "None") {
            for (var i = 0; i < json.modeItem.length; i++) {
              if (json.modeItem[i].modeType == _strSecurityType) {
                pass = json.modeItem[i].key;
                break;
              }
            }
            $("#wl_wifi_password").val(pass);
          }
        });
      });

      $("#wl_advanced_autooff_function_checkbox").unbind("change");
      $("#wl_advanced_autooff_function_checkbox").bind("change", function () {
        if ($("#wl_advanced_autooff_function_checkbox").is(":checked")) {
          $("#div_autoOff").hide();
        } else {
          $("#div_autoOff").show();
        }
      });

      $("#lt_radio_enable").unbind("click");
      $("#lt_radio_enable").bind("click", function () {
        if ($("#lt_radio_enable").is(":checked")) {
          $("#div_advanced").show();
          callJSON("uapxb_wlan_basic_settings", function (json) {
            if (json.proto == "wifi") {
              $("#wl_advanced_primary_channel_select").attr("disabled", true);
              $("#wl_advanced_primary_channel_select").css(
                "backgroundColor",
                "#ddd"
              );
            } else {
              $("#wl_advanced_primary_channel_select").attr("disabled", false);
              $("#wl_advanced_primary_channel_select").css(
                "backgroundColor",
                "#fff"
              );
            }
            $("#wl_advanced_80211_mode_select").val(json.net_mode);
            $("#wl_advanced_primary_channel_select").val(json.channel);
            $("#wl_advanced_maximum_simultaneous_clients_select").val(
              json.max_clients
            );
            $("#wl_advanced_ap_isolate_select").val(json.ap_isolate);
          });
        } else {
          $("#div_advanced").hide();
        }
      });

      $("#lt_radio_disable").unbind("click");
      $("#lt_radio_disable").bind("click", function () {
        if ($("#lt_radio_enable").is(":checked")) {
          $("#div_advanced").show();
          callJSON("uapxb_wlan_basic_settings", function (json) {
            if (json.proto == "wifi") {
              $("#wl_advanced_primary_channel_select").attr("disabled", true);
              $("#wl_advanced_primary_channel_select").css(
                "backgroundColor",
                "#ddd"
              );
            } else {
              $("#wl_advanced_primary_channel_select").attr("disabled", false);
              $("#wl_advanced_primary_channel_select").css(
                "backgroundColor",
                "#fff"
              );
            }
            $("#wl_advanced_80211_mode_select").val(json.net_mode);
            $("#wl_advanced_primary_channel_select").val(json.channel);
            $("#wl_advanced_maximum_simultaneous_clients_select").val(
              json.max_clients
            );
            $("#wl_advanced_ap_isolate_select").val(json.ap_isolate);
          });
        } else {
          $("#div_advanced").hide();
        }
      });
    };
    this.wifiQuickSetup = function () {
      $("#btn_wl_basic_settings_apply").unbind("click");
      $("#btn_wl_basic_settings_apply").bind("click", function () {
        if (that.checkQuickSetup()) {
          var ssidName = $("#wl_nnSSID").val().trim();
          var wifiPass = $("#wl_wifi_password").val();
          var mode = $("#wl_selectSecurityModeType").val();
          var ssid_status = $("#wl_advanced_status_radio_enable").is(":checked")
            ? "1"
            : "0";
          var jsonData = {};
          jsonData.ssid = UniEncode(ssidName);
          jsonData.ssid_bcast = ssid_status;
          jsonData.modeType = mode;
          if (mode == "WPA2-PSK" || mode == "Mixed") {
            jsonData.key = wifiPass;
            jsonData.mode = quickset_StrCipher;
          }
          showWait();
          setTimeout(function () {
            postJSON("uapx_wlan_security_settings", jsonData, function (data) {
              if (data.result == "success") {
                showMsgBox(
                  jQuery.i18n.prop("dialog_message_wifi_settings_title"),
                  jQuery.i18n.prop(
                    "dialog_message_wifi_settings_modify_wifi_param_success"
                  )
                );
                that.onLoad(false);
              } else {
                showMsgBox(
                  jQuery.i18n.prop("dialog_message_wifi_settings_title"),
                  jQuery.i18n.prop(
                    "dialog_message_wifi_settings_modify_wifi_param_fail"
                  )
                );
              }
            });
          }, 100);
        }
      });
    };
    this.checkQuickSetup = function () {
      var ssid = $("#wl_nnSSID").val().trim();
      $("#QuickSetup_error").hide();
      if (ssid == "" || !ssid || ssid.length == 0) {
        $("#QuickSetup_error").html(jQuery.i18n.prop("lt_wifiSet_SsidIsEmpty"));
        $("#QuickSetup_error").show();
        return false;
      }
      if (!isSSID(ssid)) {
        $("#QuickSetup_error").html(jQuery.i18n.prop("input_ssid_error"));
        $("#QuickSetup_error").show();
        return false;
      }
      var tempPassword = $("#wl_wifi_password").val();
      var mode = $("#wl_selectSecurityModeType").val();
      if (mode != "None") {
        if (!tempPassword || tempPassword == "") {
          $("#QuickSetup_error").html(
            jQuery.i18n.prop("lvpn_password_IsEmpty")
          );
          $("#QuickSetup_error").show();
          return false;
        }
        if (tempPassword.length < 8) {
          $("#QuickSetup_error").html(jQuery.i18n.prop("lminLengthError8"));
          $("#QuickSetup_error").show();
          return false;
        }
        if (tempPassword.length > 64) {
          $("#QuickSetup_error").html(jQuery.i18n.prop("lmaxLengthError64"));
          $("#QuickSetup_error").show();
          return false;
        }
        if (IsChineseChar(tempPassword)) {
          $("#QuickSetup_error").html(
            jQuery.i18n.prop("lt_wifiset_WPA2PSKPasswdError2")
          );
          $("#QuickSetup_error").show();
          return false;
        }
      }
      return true;
    };
    this.displayControls = function () {
      $("#lt_wifiSet_title").html(jQuery.i18n.prop("mWifiInfoSet"));
      $("#label_wl_advanced_status_radio_enable").html(
        jQuery.i18n.prop("lt_SSIDDisabledSwitch")
      );
      $("#sp_wl_advanced_status_radio_enable").html(
        jQuery.i18n.prop("lt_optEnableSwitch")
      );
      $("#sp_wl_advanced_status_radio_disable").html(
        jQuery.i18n.prop("lt_optDisabledSwitch")
      );
      $("#td_wl_ssid_name").html(jQuery.i18n.prop("lt_wifiSet_SSID"));
      $("#td_wl_security_mode").html(jQuery.i18n.prop("lt_wifiSet_AuthType"));
      $("#wl_sec_mixed").html(jQuery.i18n.prop("lt_wifiSet_WPAWPA2"));
      $("#wl_sec_psk").html(jQuery.i18n.prop("lt_wifiSet_WPA2"));
      $("#wl_sec_open").html(jQuery.i18n.prop("lt_wifiSet_None"));
      $("#wl_wifi_showPassword").html(jQuery.i18n.prop("lt_wifiSet_showPaw"));
      $("#td_wl_wifi_password").html(jQuery.i18n.prop("lt_wifiSet_passwd"));
      $("#btn_wl_basic_settings_apply").val(jQuery.i18n.prop("lt_btnSave"));
      $("#h_wireless_advanced_settings_title").html(
        jQuery.i18n.prop("h_wireless_advanced_settings_title")
      );
      $("#lt_wifi_status").html(jQuery.i18n.prop("lt_dashbd_wifiStatus"));
      $("#span_status_enable").html(jQuery.i18n.prop("lt_optEnable"));
      $("#span_status_disable").html(jQuery.i18n.prop("lt_optDisable"));
      $("#td_wl_advanced_80211_mode").html(
        jQuery.i18n.prop("lt_wifiSet_wifiNetMode")
      );
      $("#td_wl_advanced_primary_channel").html(
        jQuery.i18n.prop("lt_wifiSet_wifiChannel")
      );

      $("#td_wl_advanced_maximum_simultaneous_clients").html(
        jQuery.i18n.prop("lMaxClients")
      );
      $("#td_wl_advanced_ap_isolate").html(
        jQuery.i18n.prop("lt_wifiSet_ApIsolateSwitch")
      );
      $("#drop_Close").html(jQuery.i18n.prop("DisabledApIsolateSwitch"));
      $("#drop_Open").html(jQuery.i18n.prop("EnableApIsolateSwitch"));
      $("#btn_advanced_settings_apply").val(jQuery.i18n.prop("lt_btnSave"));
      $("#lWifiAutoOffFun").html(jQuery.i18n.prop("lWifiAutoOffFun"));
      $("#span_advance_autoOff").html(jQuery.i18n.prop("lDisableWifiAutoOff"));
      $("#td_wl_advanced_wifi_sleep_function").html(
        jQuery.i18n.prop("lt_wifiSet_AutoOffWifiTimeout")
      );
      $("#span_sleep_text").html(jQuery.i18n.prop("sSleepTimeUint"));
      $("#btn_autoOff_settings_apply").val(jQuery.i18n.prop("lt_btnSave"));
      $("#dropdown_80211n").html(jQuery.i18n.prop("lt_wifiSet_opt80211n"));
      $("#dropdown_80211bg").html(jQuery.i18n.prop("lt_wifiSet_opt80211gb"));
      $("#dropdown_80211b_only").html(
        jQuery.i18n.prop("lt_wifiSet_opt80211b_only")
      );
      $("#dropdown_80211g_only").html(
        jQuery.i18n.prop("lt_wifiSet_opt80211g_only")
      );
    };
    return this;
  };
})(jQuery);

function isSSID(value) {
  if (/^[\u0000-\u007F]{1,32}$/.test(value)) {
    return true;
  } else {
    return false;
  }
}
// -------------------------------------------------------------objWPS-----------------------------------------------------------------
var isWpsMatch = false;
var wpsItervalID;
var queryWPSStartTime = 0;
(function ($) {
  $.objWPS = function () {
    var that = this;
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.btnEvent();
      }
      that.showData();
      setDlgStyle();
    };
    this.showData = function () {
      if (isWpsMatch) {
        wpsItervalID = setInterval(function () {
          that.QueryWpsStatus();
        }, 3000);
        queryWPSStartTime = new Date().getTime();
      } else {
        if (wpsItervalID) {
          clearInterval(wpsItervalID);
        }
        $("#tr_wl_wps_matching").hide();
        $("#span_wl_wps_Status").text("");
        $("#span_wl_wps_errorPIN").text("");

        $("#btn_wl_wps_register").attr("disabled", false);
        $("#btn_wl_wps_register").removeClass("disBtn");
        $("#btn_wl_wps_pair").attr("disabled", false);
        $("#btn_wl_wps_pair").removeClass("disBtn");
        $("#wl_wps_pin_text").attr("disabled", false);
        $("#wl_wps_pin_text").css("backgroundColor", "#fff");
      }
    };
    this.QueryWpsStatus = function () {
      callJSON("uapxb_wlan_security_settings", function (json) {
        var WPSStatus = json.wps_status;

        $("#btn_wl_wps_register").attr("disabled", false);
        $("#btn_wl_wps_register").removeClass("disBtn");
        $("#btn_wl_wps_pair").attr("disabled", false);
        $("#btn_wl_wps_pair").removeClass("disBtn");
        $("#wl_wps_pin_text").attr("disabled", false);
        $("#wl_wps_pin_text").css("backgroundColor", "#fff");
        $("#tr_wl_wps_matching").hide();
        isWpsMatch = false;
        if (WPSStatus == 0) {
          $("#span_wl_wps_Status").text("");
        } else if (WPSStatus == 1) {
          $("#btn_wl_wps_register").attr("disabled", true);
          $("#btn_wl_wps_register").addClass("disBtn");
          $("#btn_wl_wps_pair").attr("disabled", true);
          $("#btn_wl_wps_pair").addClass("disBtn");
          $("#wl_wps_pin_text").attr("disabled", true);
          $("#wl_wps_pin_text").css("backgroundColor", "#ddd");
          $("#tr_wl_wps_matching").show();

          isWpsMatch = true;
        } else if (WPSStatus == 2) {
          $("#span_wl_wps_Status").text(jQuery.i18n.prop("lWpsMatchSuccess"));
        } else if (WPSStatus == 3) {
          $("#span_wl_wps_Status").text(jQuery.i18n.prop("lWpsMatchFailed"));
        } else if (WPSStatus == 4) {
          $("#span_wl_wps_Status").text(jQuery.i18n.prop("lWpsMatchInterrupt"));
        } else if (WPSStatus == 5) {
          $("#span_wl_wps_Status").text(jQuery.i18n.prop("lWpsPinCheckFail"));
        } else {
          $("#span_wl_wps_Status").text("Unkown Error.");
        }

        if (WPSStatus != 1) {
          clearInterval(wpsItervalID);
          return;
        }

        var currentTime = new Date().getTime();
        if (currentTime - queryWPSStartTime > 180000) {
          that.closeWPSClient();
        }
      });
    };
    this.closeWPSClient = function () {
      clearInterval(wpsItervalID);
      isWpsMatch = false;

      $("#tr_wl_wps_matching").hide();
      $("#span_wl_wps_errorPIN").text("");
      $("#span_wl_wps_Status").text("");

      $("#btn_wl_wps_register").attr("disabled", false);
      $("#btn_wl_wps_register").removeClass("disBtn");
      $("#btn_wl_wps_pair").attr("disabled", false);
      $("#btn_wl_wps_pair").removeClass("disBtn");
      $("#wl_wps_pin_text").attr("disabled", false);
      $("#wl_wps_pin_text").css("backgroundColor", "#fff");
    };
    this.btnEvent = function () {
      $("#wl_wps_pin_text").unbind("input");
      $("#wl_wps_pin_text").bind("input", function () {
        $("#span_wl_wps_errorPIN").text("");
        $("#span_wl_wps_Status").text("");
        var client_pin = $("#wl_wps_pin_text").val();
        if ("-" == client_pin.substr(4, 1)) {
          client_pin = client_pin.replace("-", "");
        }
        if (
          !(client_pin.length == 8 || client_pin.length == 4) ||
          !Number(client_pin)
        ) {
          $("#span_wl_wps_errorPIN").text(jQuery.i18n.prop("lWPSPinError"));
          isWpsMatch = false;

          $("#btn_wl_wps_register").attr("disabled", true);
          $("#btn_wl_wps_register").addClass("disBtn");
        } else {
          $("#btn_wl_wps_register").attr("disabled", false);
          $("#btn_wl_wps_register").removeClass("disBtn");
        }
      });

      $("#btn_wl_wps_register").unbind("click");
      $("#btn_wl_wps_register").bind("click", function () {
        $("#tr_wl_wps_matching").hide();
        $("#span_wl_wps_Status").text("");
        $("#span_wl_wps_errorPIN").text("");

        var client_pin = $("#wl_wps_pin_text").val();
        if ("-" == client_pin.substr(4, 1)) {
          client_pin = client_pin.replace("-", "");
        }

        if (
          (client_pin.length == 8 || client_pin.length == 4) &&
          Number(client_pin)
        ) {
          var jsonData = {};
          jsonData.connect_method = "2";
          jsonData.wps_pin = client_pin;
          showWait();
          setTimeout(function () {
            postJSON("uapxb_wlan_security_settings", jsonData, function () {
              showWait();
              setTimeout(function () {
                isWpsMatch = false;
                that.onLoad(false);
                clearInterval(wpsItervalID);
              }, 100);
            });
            setTimeout(function () {
              that.QueryWpsStatusEx();
            }, 3000);
          }, 100);
        } else {
          $("#span_wl_wps_errorPIN").text(jQuery.i18n.prop("lWPSPinError"));
          isWpsMatch = false;
        }
        clearInterval(wpsItervalID);
      });

      $("#btn_wl_wps_pair").unbind("click");
      $("#btn_wl_wps_pair").bind("click", function () {
        $("#span_wl_wps_Status").text("");
        var jsonData = {};
        jsonData.connect_method = "1";
        showWait();
        setTimeout(function () {
          postJSON("uapxb_wlan_security_settings", jsonData, function () {
            showWait();
            setTimeout(function () {
              closeWait();
            }, 3000);
            isWpsMatch = true;
            that.onLoad(false);
          });
        }, 100);
      });

      $("#btn_wl_wps_cancel_matching").unbind("click");
      $("#btn_wl_wps_cancel_matching").bind("click", function () {
        var jsonData = {};
        jsonData.connect_method = "3";
        showWait();
        setTimeout(function () {
          postJSON("uapxb_wlan_security_settings", jsonData, function () {
            isWpsMatch = false;
            if (wpsItervalID) {
              clearInterval(wpsItervalID);
            }
            that.onLoad(false);
          });
          $("#tr_wl_wps_matching").hide();
        }, 100);
      });
    };
    this.QueryWpsStatusEx = function () {
      callJSON("uapxb_wlan_security_settings", function (json) {
        var WPSStatus = parseInt(json.wps_status);
        if (WPSStatus == 1) {
          setTimeout(function () {
            that.QueryWpsStatusEx();
          }, 4000);
        } else if (WPSStatus == 2) {
          closeWait();
          showMsgBox(
            jQuery.i18n.prop("lWarning"),
            jQuery.i18n.prop("lWpsMatchSuccess")
          );
        } else if (WPSStatus == 3) {
          closeWait();
          showMsgBox(
            jQuery.i18n.prop("lWarning"),
            jQuery.i18n.prop("lWpsMatchFailed")
          );
        } else if (WPSStatus == 4) {
          closeWait();
          showMsgBox(
            jQuery.i18n.prop("lWarning"),
            jQuery.i18n.prop("lWpsMatchInterrupt")
          );
        } else if (WPSStatus == 5) {
          closeWait();
          showMsgBox(
            jQuery.i18n.prop("lWarning"),
            jQuery.i18n.prop("lWpsPinCheckFail")
          );
        }
      });
    };
    this.displayControls = function () {
      $("#h_wireless_wps_settings_title").html(
        jQuery.i18n.prop("h1AddWPSClient")
      );
      $("#td_wl_wps_choose_method").html(jQuery.i18n.prop("lWPStext"));
      $("#td_wl_wps_pair_method").html(jQuery.i18n.prop("spanWPSPushButton"));
      $("#btn_wl_wps_pair").val(jQuery.i18n.prop("btnPush"));
      $("#td_wl_wps_pin_method").html(jQuery.i18n.prop("spanEnterPin"));
      $("#btn_wl_wps_register").val(jQuery.i18n.prop("btnRegister"));
      $("#td_wl_wps_matching").html(jQuery.i18n.prop("lWpsMatchPro"));
      $("#btn_wl_wps_cancel_matching").val(jQuery.i18n.prop("lt_btnCancel"));
    };
    return this;
  };
})(jQuery);
// -------------------------------------------------------------objWifiMACFilter-----------------------------------------------------------------
(function ($) {
  $.objWifiMACFilter = function () {
    var that = this;
    var allchecked = false;
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.btnEvent();
      }
      that.showData();
      setDlgStyle();
    };
    this.showData = function () {
      callJSON("uapx_wlan_mac_filters", function (json) {
        if (json.enable == "0") {
          $("#radio_MacFilter_disabled").attr("checked", true);
          $("#div_AwDn").hide();
          $("#div_MacFilterList").hide();
        } else {
          $("#div_AwDn").show();
          $("#div_MacFilterList").show();
          $("#radio_MacFilter_enabled").attr("checked", true);
          if (json.mode == "1") {
            $("#radio_MacFilter_allow").attr("checked", true);
            $("#lMacFilterListLabel").html(
              jQuery.i18n.prop("lt_macFilter_AllowMacAddrList")
            );
          } else {
            $("#radio_MacFilter_deny").attr("checked", true);
            $("#lMacFilterListLabel").html(
              jQuery.i18n.prop("lt_macFilter_DenyMacAddrList")
            );
          }
        }
        var macHTML = "";
        if (json.mode == "1") {
          for (var i = 0; i < json.allow_list.length; i++) {
            macHTML +=
              "<tr><td>" +
              json.allow_list[i].mac +
              '</td><td><input class="mac_del" name="' +
              json.allow_list[i].index +
              "*&*" +
              json.allow_list[i].mac +
              "\" type='checkbox'></td></tr>";
          }
        } else {
          for (var j = 0; j < json.deny_list.length; j++) {
            macHTML +=
              "<tr><td>" +
              json.deny_list[j].mac +
              '</td><td><input class="mac_del" name="' +
              json.deny_list[j].index +
              "*&*" +
              json.deny_list[j].mac +
              "\" type='checkbox'></td></tr>";
          }
        }
        if (macHTML == "") {
          macHTML =
            '<tr><td colspan="2">' +
            jQuery.i18n.prop("tableNoData") +
            "</td></tr>";
          $("#DeleteAllIpEntry").attr("disabled", true);
          $("#DeleteAllIpEntry").attr("checked", false);
        } else {
          $("#DeleteAllIpEntry").attr("disabled", false);
          $("#DeleteAllIpEntry").attr("checked", false);
        }
        $("#lt_macFilter_btnDeleteMacFilter").hide();
        $("#tbodyMacAddrList").html(macHTML);
        that.bindChecked();
      });
    };
    this.showAloowDenyList = function () {
      callJSON("uapx_wlan_mac_filters", function (json) {
        if ($("#radio_MacFilter_allow").is(":checked")) {
          $("#radio_MacFilter_allow").attr("checked", true);
          $("#lMacFilterListLabel").html(
            jQuery.i18n.prop("lt_macFilter_AllowMacAddrList")
          );
        } else {
          $("#radio_MacFilter_deny").attr("checked", true);
          $("#lMacFilterListLabel").html(
            jQuery.i18n.prop("lt_macFilter_DenyMacAddrList")
          );
        }
        var macHTML = "";
        if ($("#radio_MacFilter_allow").is(":checked")) {
          for (var i = 0; i < json.allow_list.length; i++) {
            macHTML +=
              "<tr><td>" +
              json.allow_list[i].mac +
              '</td><td><input class="mac_del" name="' +
              json.allow_list[i].index +
              "*&*" +
              json.allow_list[i].mac +
              "\" type='checkbox'></td></tr>";
          }
        } else {
          for (var j = 0; j < json.deny_list.length; j++) {
            macHTML +=
              "<tr><td>" +
              json.deny_list[j].mac +
              '</td><td><input class="mac_del" name="' +
              json.deny_list[j].index +
              "*&*" +
              json.deny_list[j].mac +
              "\" type='checkbox'></td></tr>";
          }
        }
        if (macHTML == "") {
          macHTML =
            '<tr><td colspan="2">' +
            jQuery.i18n.prop("tableNoData") +
            "</td></tr>";
          $("#DeleteAllIpEntry").attr("disabled", true);
          $("#DeleteAllIpEntry").attr("checked", false);
        } else {
          $("#DeleteAllIpEntry").attr("disabled", false);
          $("#DeleteAllIpEntry").attr("checked", false);
        }
        $("#lt_macFilter_btnDeleteMacFilter").hide();
        $("#tbodyMacAddrList").html(macHTML);
        that.bindChecked();
      });
    };
    this.btnEvent = function () {
      $("#addMacBoxclose").unbind("click");
      $("#addMacBoxclose").bind("click", function () {
        $("#divMACFilterDlg").hide();
      });

      $("#lt_btnCancel").unbind("click");
      $("#lt_btnCancel").bind("click", function () {
        $("#divMACFilterDlg").hide();
      });

      $("#btn_addMac").unbind("click");
      $("#btn_addMac").bind("click", function () {
        $("#divMACFilterDlg input[type='text']").val("");
        $("#divMACFilterDlg").show();
        setDlgStyle();
        $("#lt_macFilter_MacError").hide();
        setAddBoxHeigth("divMACFilterDlg");
      });

      $("#radio_MacFilter_enabled").unbind("click");
      $("#radio_MacFilter_enabled").bind("click", function () {
        if ($("#radio_MacFilter_enabled").is(":checked")) {
          $("#div_AwDn").show();
          $("#div_MacFilterList").show();
          that.showAloowDenyList();
        } else {
          $("#div_AwDn").hide();
          $("#div_MacFilterList").hide();
        }
      });

      $("#radio_MacFilter_disabled").unbind("click");
      $("#radio_MacFilter_disabled").bind("click", function () {
        if ($("#radio_MacFilter_enabled").is(":checked")) {
          $("#div_AwDn").show();
          $("#div_MacFilterList").show();
          that.showAloowDenyList();
        } else {
          $("#div_AwDn").hide();
          $("#div_MacFilterList").hide();
        }
      });

      $("#radio_MacFilter_allow").unbind("click");
      $("#radio_MacFilter_allow").bind("click", function () {
        if ($("#radio_MacFilter_allow").is(":checked")) {
          $("#lMacFilterListLabel").html(
            jQuery.i18n.prop("lt_macFilter_AllowMacAddrList")
          );
          that.showAloowDenyList();
        } else {
          $("#lMacFilterListLabel").html(
            jQuery.i18n.prop("lt_macFilter_DenyMacAddrList")
          );
          that.showAloowDenyList();
        }
      });

      $("#radio_MacFilter_deny").unbind("click");
      $("#radio_MacFilter_deny").bind("click", function () {
        if ($("#radio_MacFilter_allow").is(":checked")) {
          $("#lMacFilterListLabel").html(
            jQuery.i18n.prop("lt_macFilter_AllowMacAddrList")
          );
          that.showAloowDenyList();
        } else {
          $("#lMacFilterListLabel").html(
            jQuery.i18n.prop("lt_macFilter_DenyMacAddrList")
          );
          that.showAloowDenyList();
        }
      });

      $("#lt_macFilter_btnDeleteMacFilter").unbind("click");
      $("#lt_macFilter_btnDeleteMacFilter").bind("click", function () {
        that.delMac();
      });

      $("#lt_btnSave").unbind("click");
      $("#lt_btnSave").bind("click", function () {
        that.addMac();
      });

      $("#btn_macFilter_apply").unbind("click");
      $("#btn_macFilter_apply").bind("click", function () {
        var jsonData = {};
        if ($("#radio_MacFilter_enabled").is(":checked")) {
          jsonData.enable = "1";
        } else {
          jsonData.enable = "0";
        }
        if ($("#radio_MacFilter_allow").is(":checked")) {
          jsonData.mode = "1";
        } else {
          jsonData.mode = "2";
        }
        showWait();
        setTimeout(function () {
          postJSON("uapx_wlan_mac_filters", jsonData, function (data) {
            if (data.result != "success") {
              showMsgBox(
                jQuery.i18n.prop("mWifiMACFilter"),
                jQuery.i18n.prop("ls_save_time_failure")
              );
            } else {
              that.onLoad(false);
            }
          });
        }, 100);
      });
    };
    this.addMac = function () {
      if (that.checkMac()) {
        showWait();
        setTimeout(function () {
          var mac_val =
            $("#txtMac1").val() +
            ":" +
            $("#txtMac2").val() +
            ":" +
            $("#txtMac3").val() +
            ":" +
            $("#txtMac4").val() +
            ":" +
            $("#txtMac5").val() +
            ":" +
            $("#txtMac6").val();
          var jsonData = {};
          if ($("#radio_MacFilter_enabled").is(":checked")) {
            jsonData.enable = "1";
          } else {
            jsonData.enable = "0";
          }
          if ($("#radio_MacFilter_allow").is(":checked")) {
            jsonData.mode = "1";
            jsonData.allow_list = {};
            jsonData.allow_list.mac = mac_val;
          } else {
            jsonData.mode = "2";
            jsonData.deny_list = {};
            jsonData.deny_list.mac = mac_val;
          }
          postJSON("uapx_wlan_mac_filters", jsonData, function (data) {
            if (data.result != "success") {
              showMsgBox(
                jQuery.i18n.prop("mWifiMACFilter"),
                jQuery.i18n.prop("dialog_message_mac_filter_add_fail")
              );
            } else {
              $("#divMACFilterDlg").hide();
              that.onLoad(false);
            }
          });
        }, 100);
      }
    };
    this.delMac = function () {
      var delList = "";
      $("#tbodyMacAddrList .mac_del").each(function (index) {
        if ($(this).is(":checked")) {
          var del = $(this).attr("name").split("*&*");
          delList += parseInt(del[0]) - 1 + ",";
        }
      });
      var jsonData = {};
      if ($("#radio_MacFilter_enabled").is(":checked")) {
        jsonData.enable = "1";
      } else {
        jsonData.enable = "0";
      }
      if ($("#radio_MacFilter_allow").is(":checked")) {
        jsonData.mode = "1";
        jsonData.allow_delete_index = delList;
      } else {
        jsonData.mode = "2";
        jsonData.deny_delete_index = delList;
      }
      showWait();
      setTimeout(function () {
        postJSON("uapx_wlan_mac_filters", jsonData, function (data) {
          if (data.result != "success") {
            showMsgBox(
              jQuery.i18n.prop("mWifiMACFilter"),
              jQuery.i18n.prop("dialog_message_mac_filter_delete_fail")
            );
          } else {
            that.onLoad(false);
          }
        });
      }, 100);
    };
    this.checkMac = function () {
      if (
        $("#txtMac1").val() == "" ||
        $("#txtMac2").val() == "" ||
        $("#txtMac3").val() == "" ||
        $("#txtMac4").val() == "" ||
        $("#txtMac5").val() == "" ||
        $("#txtMac6").val() == ""
      ) {
        $("#lt_macFilter_MacError").html(jQuery.i18n.prop("MAC_ADDR_IS_EMPTY"));
        $("#lt_macFilter_MacError").show();
        return false;
      }
      var mac =
        $("#txtMac1").val() +
        ":" +
        $("#txtMac2").val() +
        ":" +
        $("#txtMac3").val() +
        ":" +
        $("#txtMac4").val() +
        ":" +
        $("#txtMac5").val() +
        ":" +
        $("#txtMac6").val();
      var regex = /^([0-9a-f]{2}([:-]|$)){6}$|([0-9a-f]{4}([.]|$)){3}$/i;
      if (!regex.test(mac)) {
        $("#lt_macFilter_MacError").html(
          jQuery.i18n.prop("lt_MacAddrFormatError")
        );
        $("#lt_macFilter_MacError").show();
        return false;
      }
      var sel_val = $("#selMacFilterSwitch").val();
      if (sel_val == "1") {
        if (allow_Arr.length >= 10) {
          $("#lt_macFilter_MacError").html(
            jQuery.i18n.prop("lt_mac_max_length")
          );
          $("#lt_macFilter_MacError").show();
          return false;
        }
        for (var i = 0; i < allow_Arr.length; i++) {
          if (allow_Arr[i] == mac) {
            $("#lt_macFilter_MacError").html(
              jQuery.i18n.prop("MAC_ADDR_EXIST")
            );
            $("#lt_macFilter_MacError").show();
            return false;
          }
        }
      } else if (sel_val == "2") {
        if (deny_Arr.length >= 10) {
          $("#lt_macFilter_MacError").html(
            jQuery.i18n.prop("lt_mac_max_length")
          );
          $("#lt_macFilter_MacError").show();
          return false;
        }
        for (var j = 0; j < deny_Arr.length; j++) {
          if (deny_Arr[j] == mac) {
            $("#lt_macFilter_MacError").html(
              jQuery.i18n.prop("MAC_ADDR_EXIST")
            );
            $("#lt_macFilter_MacError").show();
            return false;
          }
        }
      }

      return true;
    };
    this.bindChecked = function () {
      $("#DeleteAllIpEntry").unbind("click");
      $("#DeleteAllIpEntry").bind("click", function () {
        if ($("#DeleteAllIpEntry").is(":checked")) {
          if ($("#tbodyMacAddrList").html() != "") {
            $("#tbodyMacAddrList .mac_del").prop("checked", true);
            $("#lt_macFilter_btnDeleteMacFilter").show();
          }
        } else {
          $("#tbodyMacAddrList .mac_del").prop("checked", false);
          $("#lt_macFilter_btnDeleteMacFilter").hide();
        }
      });
      $("#tbodyMacAddrList .mac_del").each(function () {
        $(this).unbind("click");
        $(this).bind("click", function () {
          allchecked = true;
          $("#lt_macFilter_btnDeleteMacFilter").hide();
          $("#tbodyMacAddrList .mac_del").each(function (index) {
            if ($(this).is(":checked")) {
              $("#lt_macFilter_btnDeleteMacFilter").show();
            } else {
              allchecked = false;
            }
          });
          if (allchecked) {
            $("#DeleteAllIpEntry").prop("checked", true);
          } else {
            $("#DeleteAllIpEntry").prop("checked", false);
          }
        });
      });
    };
    this.displayControls = function () {
      $("#lt_macFilter_title").html(jQuery.i18n.prop("mWifiMACFilter"));
      $("#lMF").html(jQuery.i18n.prop("lt_macFilter_title"));
      $("#span_MacFilter_enabled").html(jQuery.i18n.prop("lt_optEnableSwitch"));
      $("#span_MacFilter_disabled").html(
        jQuery.i18n.prop("lt_optDisabledSwitch")
      );
      $("#lMS").html(jQuery.i18n.prop("lt_macFilter_MacFilterSwitch"));
      $("#span_MacFilter_allow").html(
        jQuery.i18n.prop("lt_macFilter_AllowdMode")
      );
      $("#span_MacFilter_deny").html(jQuery.i18n.prop("lt_macFilter_DenyMode"));
      $("#btn_macFilter_apply").val(jQuery.i18n.prop("lt_btnSave"));
      $("#lt_macFilter_clientMacAddrList").html(
        jQuery.i18n.prop("lt_macFilter_clientMacAddrList")
      );
      $("#lt_macFilter_AddMACFilterTitle").html(
        jQuery.i18n.prop("lt_macFilter_AddMACFilterTitle")
      );
      $("#lt_btnSave").val(jQuery.i18n.prop("lt_btnSave"));
      $("#lt_btnCancel").val(jQuery.i18n.prop("lt_btnCancel"));
      $("#btn_addMac").val(jQuery.i18n.prop("lt_macFilter_btnAddMacFilter"));
      $("#lt_macFilter_btnDeleteMacFilter").val(
        jQuery.i18n.prop("lt_macFilter_btnDeleteMacFilter")
      );
    };
    return this;
  };
})(jQuery);
// -------------------------------------------------------------objCustomFirewallRules-----------------------------------------------------------------
var _arrayTableDataCustomFW = [];
(function ($) {
  $.objCustomFirewallRules = function () {
    var that = this;
    var mtu_value;
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.btnEvent();
      }
      that.showData();
      setDlgStyle();
    };
    this.showData = function () {
      callJSON("custom_fw", function (json) {
        _arrayTableDataCustomFW = [];
        filer_mode = json.custom_rules_mode;
        for (var i = 0; i < json.custom_rules_list.length; i++) {
          var l = json.custom_rules_list[i];
          ruleName = l.rule_name;
          ruleName = decodeURIComponent(ruleName);
          enabled = l.enabled;
          srcIPAddress = l.src_ip;
          srcPort = l.src_port;
          dstIPAddress = l.dst_ip;
          dstPort = l.dst_port;
          protocol = l.proto;
          _arrayTableDataCustomFW.push([
            l.index,
            ruleName,
            enabled,
            srcIPAddress,
            srcPort,
            dstIPAddress,
            dstPort,
            protocol,
          ]);
        }
        that.loadTableData(_arrayTableDataCustomFW);
      });
    };
    this.loadTableData = function (arrayTableData) {
      var bodyHTML = "";

      if (arrayTableData.length === 0) {
        bodyHTML =
          '<tr><td colspan="8">' +
          jQuery.i18n.prop("tableNoData") +
          "</td></tr>";
      } else {
        for (var i = 0; i < arrayTableData.length; i++) {
          var l = arrayTableData[i];
          var index = l[0];
          var ruleName = l[1];
          var enabled = l[2];
          var srcIP = l[3] == "NA" || l[3] == "" ? "N/A" : l[3];
          var srcport = l[4] == "NA" || l[4] == "" ? "N/A" : l[4];
          var dstIP = l[5] == "NA" || l[5] == "" ? "N/A" : l[5];
          var dstport = l[6] == "NA" || l[6] == "" ? "N/A" : l[6];
          var protocol = l[7];
          bodyHTML +=
            '<tr><td name="' +
            index +
            '"  onclick="customFWRuleClicked(this)" style="color:#05bda1;cursor:pointer;">' +
            ruleName +
            "</td><td>" +
            enabled +
            "</td><td>" +
            srcIP +
            "</td><td>" +
            srcport +
            "</td><td>" +
            dstIP +
            "</td><td>" +
            dstport +
            "</td><td>" +
            protocol +
            '</td><td><sapn name="' +
            index +
            '" onclick="deleteFirewallRule(this)" class="delete_spanBtn">&times;</span></td></tr>';
        }
      }
      $("#firewallFulesBody").html(bodyHTML);
    };
    this.btnEvent = function () {
      $("#addFirewallRuleclose").unbind("click");
      $("#addFirewallRuleclose").bind("click", function () {
        $("#divFirewallRuleDlg").hide();
      });

      $("#lt_btnCancel").unbind("click");
      $("#lt_btnCancel").bind("click", function () {
        $("#divFirewallRuleDlg").hide();
      });

      $("#btn_add_firewallRule").unbind("click");
      $("#btn_add_firewallRule").bind("click", function () {
        if (_arrayTableDataCustomFW.length >= 8) {
          showMsgBox(
            jQuery.i18n.prop("mCustomFirewallRules"),
            jQuery.i18n.prop("OutFirewallRulesRange")
          );
          return;
        }
        $("input[type='text']").val("");
        $("#divFirewallRuleDlg").show();
        setAddBoxHeigth("divFirewallRuleDlg");
        $("#txtRulename").attr("disabled", false);
        $("#txtRulename").removeClass("dhcp_disabled");
        $("#firewallRule_error").hide();
        $("#lt_btnAdd").show();
        $("#lt_btnSave").hide();
      });

      $("#txtRulename").unbind("input");
      $("#txtRulename").bind("input", function () {
        that.checkRuleName();
      });

      $("#lt_btnSave").unbind("click");
      $("#lt_btnSave").bind("click", function () {
        if (that.checkIPPort()) {
          var jsonData = {};
          jsonData.custom_rules_list = {};
          var ruleName = encodeURIComponent($("#txtRulename").val());
          var enabled = $("#radio_enabled").is(":checked") ? "1" : "0";
          var src_ip =
            $("#sourceIP1").val() +
            "." +
            $("#sourceIP2").val() +
            "." +
            $("#sourceIP3").val() +
            "." +
            $("#sourceIP4").val();
          var src_netmask = $("#sourceIP5").val();
          var src_port =
            $("#sourcePort1").val() + ":" + $("#sourcePort2").val();
          var dst_ip =
            $("#destinationIP1").val() +
            "." +
            $("#destinationIP2").val() +
            "." +
            $("#destinationIP3").val() +
            "." +
            $("#destinationIP4").val();
          var dst_netmask = $("#destinationIP5").val();
          var dst_port =
            $("#destinationPort1").val() + ":" + $("#destinationPort2").val();
          var protocol = $("#fwdSelect").val();
          jsonData.custom_rules_list.index = $("#txtRulename").attr("name");
          jsonData.custom_rules_list.rule_name = $("#txtRulename").val();
          jsonData.custom_rules_list.enabled = enabled;

          if (src_ip != "...") {
            if (src_netmask.length > 0) src_ip = src_ip + "/" + src_netmask;
            jsonData.custom_rules_list.src_ip = src_ip;
          } else {
            jsonData.custom_rules_list.src_ip = "NA";
          }
          jsonData.custom_rules_list.src_port =
            src_port != ":" ? src_port : "NA";

          if (dst_ip != "...") {
            if (dst_netmask.length > 0) {
              dst_ip = dst_ip + "/" + dst_netmask;
            }
            jsonData.custom_rules_list.dst_ip = dst_ip;
          } else {
            jsonData.custom_rules_list.dst_ip = "NA";
          }
          jsonData.custom_rules_list.dst_port =
            dst_port != ":" ? dst_port : "NA";
          jsonData.custom_rules_list.proto = protocol;
          showWait();
          setTimeout(function () {
            postJSON("custom_fw", jsonData, function (data) {
              if (data.result != "success") {
                showMsgBox(
                  jQuery.i18n.prop("mCustomFirewallRules"),
                  jQuery.i18n.prop("ls_save_time_failure")
                );
              } else {
                that.onLoad(false);
                $("#divFirewallRuleDlg").hide();
              }
            });
          }, 100);
        }
      });

      $("#lt_btnAdd").unbind("click");
      $("#lt_btnAdd").bind("click", function () {
        if (that.checkRuleName() && that.checkIPPort()) {
          var jsonData = {};
          jsonData.custom_rules_list = {};
          var ruleName = encodeURIComponent($("#txtRulename").val());
          var enabled = $("#radio_enabled").is(":checked") ? "1" : "0";
          var src_ip =
            $("#sourceIP1").val() +
            "." +
            $("#sourceIP2").val() +
            "." +
            $("#sourceIP3").val() +
            "." +
            $("#sourceIP4").val();
          var src_netmask = $("#sourceIP5").val();
          var src_port =
            $("#sourcePort1").val() + ":" + $("#sourcePort2").val();
          var dst_ip =
            $("#destinationIP1").val() +
            "." +
            $("#destinationIP2").val() +
            "." +
            $("#destinationIP3").val() +
            "." +
            $("#destinationIP4").val();
          var dst_netmask = $("#destinationIP5").val();
          var dst_port =
            $("#destinationPort1").val() + ":" + $("#destinationPort2").val();
          var protocol = $("#fwdSelect").val();
          jsonData.custom_rules_list.index = _arrayTableDataCustomFW.length;
          jsonData.custom_rules_list.rule_name = $("#txtRulename").val();
          jsonData.custom_rules_list.enabled = enabled;

          if (src_ip != "...") {
            if (src_netmask.length > 0) src_ip = src_ip + "/" + src_netmask;
            jsonData.custom_rules_list.src_ip = src_ip;
          } else {
            jsonData.custom_rules_list.src_ip = "NA";
          }
          jsonData.custom_rules_list.src_port =
            src_port != ":" ? src_port : "NA";

          if (dst_ip != "...") {
            if (dst_netmask.length > 0) {
              dst_ip = dst_ip + "/" + dst_netmask;
            }
            jsonData.custom_rules_list.dst_ip = dst_ip;
          } else {
            jsonData.custom_rules_list.dst_ip = "NA";
          }
          jsonData.custom_rules_list.dst_port =
            dst_port != ":" ? dst_port : "NA";
          jsonData.custom_rules_list.proto = protocol;
          showWait();
          setTimeout(function () {
            postJSON("custom_fw", jsonData, function (data) {
              if (data.result != "success") {
                showMsgBox(
                  jQuery.i18n.prop("mCustomFirewallRules"),
                  jQuery.i18n.prop("ls_save_time_failure")
                );
              } else {
                that.onLoad(false);
                $("#divFirewallRuleDlg").hide();
              }
            });
          }, 100);
        }
      });
    };
    this.isCustomRuleNameExist = function (name) {
      for (var i = 0; i < _arrayTableDataCustomFW.length; i++) {
        if (name == _arrayTableDataCustomFW[i][1]) {
          return true;
        }
      }
      return false;
    };
    this.checkRuleName = function () {
      $("#firewallRule_error").hide();
      var ruleName = $("#txtRulename").val();
      if (ruleName == "") {
        $("#firewallRule_error").show();
        $("#firewallRule_error").html(jQuery.i18n.prop("lEmptyName"));
        return false;
      }
      if (ruleName.length > 15 || ruleName.length < 3) {
        $("#firewallRule_error").show();
        $("#firewallRule_error").html(jQuery.i18n.prop("ruleName3_5"));
        return false;
      }
      if (that.isCustomRuleNameExist(ruleName)) {
        $("#firewallRule_error").show();
        $("#firewallRule_error").html(jQuery.i18n.prop("RuleName_ADDR_EXIST"));
        return false;
      }
      if (IsChineseChar(ruleName)) {
        $("#firewallRule_error").show();
        $("#firewallRule_error").html(jQuery.i18n.prop("lRuleNameIsChinese"));
        return false;
      }
      if (!deviceNameValidation(ruleName)) {
        $("#firewallRule_error").show();
        $("#firewallRule_error").html(
          jQuery.i18n.prop("lCustomFWSpecialCharsNotAllowed")
        );
        return false;
      }
      return true;
    };
    this.checkIPPort = function () {
      $("#firewallRule_error").hide();
      var src_ip =
        $("#sourceIP1").val() +
        "." +
        $("#sourceIP2").val() +
        "." +
        $("#sourceIP3").val() +
        "." +
        $("#sourceIP4").val();

      var src_netmask = $("#sourceIP5").val();

      var src_port = $("#sourcePort1").val() + ":" + $("#sourcePort2").val();

      var dst_ip =
        $("#destinationIP1").val() +
        "." +
        $("#destinationIP2").val() +
        "." +
        $("#destinationIP3").val() +
        "." +
        $("#destinationIP4").val();

      var dst_netmask = $("#destinationIP5").val();

      var dst_port =
        $("#destinationPort1").val() + ":" + $("#destinationPort2").val();
      var flag = isValidRule(
        src_ip,
        src_netmask,
        src_port,
        dst_ip,
        dst_netmask,
        dst_port
      );
      if (flag == 0) {
        return true;
      } else if (flag == 1) {
        $("#firewallRule_error").show();
        $("#firewallRule_error").html(jQuery.i18n.prop("lIncorrectSrcIP"));
        return false;
      } else if (flag == 2) {
        $("#firewallRule_error").show();
        $("#firewallRule_error").html(jQuery.i18n.prop("lIncorrectDstIP"));
        return false;
      } else if (flag == 3) {
        $("#firewallRule_error").show();
        $("#firewallRule_error").html(jQuery.i18n.prop("lPortNumInvalide"));
        return false;
      } else if (flag == 4) {
        $("#firewallRule_error").show();
        $("#firewallRule_error").html(jQuery.i18n.prop("lStartPortLarger"));
        return false;
      } else if (flag == 5) {
        $("#firewallRule_error").show();
        $("#firewallRule_error").html(jQuery.i18n.prop("lAtleastOne"));
        return false;
      }
    };
    this.displayControls = function () {
      $("#lt_firewall_title").html(jQuery.i18n.prop("mCustomFirewallRules"));
      $("#lt_firewall_text").html(jQuery.i18n.prop("lCustomFWRulesText"));
      $("#btn_add_firewallRule").val(jQuery.i18n.prop("btnAddRule"));
      $("#th_ruleName").html(jQuery.i18n.prop("ltRuleName"));
      $("#th_enabled").html(jQuery.i18n.prop("ltEnabled"));
      $("#th_sourceIP").html(jQuery.i18n.prop("ltSrcIP"));
      $("#th_sourcePort").html(jQuery.i18n.prop("ltSrcPort"));
      $("#th_destinationIP").html(jQuery.i18n.prop("ltDstIP"));
      $("#th_destinationPort").html(jQuery.i18n.prop("ltDstPort"));
      $("#th_protocol").html(jQuery.i18n.prop("ltProtocol"));
      $("#lt_firewallRule_AddTitle").html(jQuery.i18n.prop("h1CustomFWRule"));
      $("#lt_ruleName").html(jQuery.i18n.prop("lRuleName_fw"));
      $("#lt_status").html(jQuery.i18n.prop("lStatus_fw"));
      $("#lt_sourceIP").html(jQuery.i18n.prop("lSrcIP"));
      $("#lt_sourcePort").html(jQuery.i18n.prop("lSrcPort"));
      $("#lt_destinationIP").html(jQuery.i18n.prop("lDstIP"));
      $("#lt_destinationPort").html(jQuery.i18n.prop("lDstPort"));
      $("#lt_protocol").html(jQuery.i18n.prop("lProtocol"));
      $("#span_enabled").html(jQuery.i18n.prop("lt_optEnableSwitch"));
      $("#span_disabled").html(jQuery.i18n.prop("lt_optDisabledSwitch"));
      $("#lt_btnAdd").val(jQuery.i18n.prop("btnAddAccessLogsRule"));
      $("#lt_btnSave").val(jQuery.i18n.prop("lt_btnSave"));
      $("#lt_btnCancel").val(jQuery.i18n.prop("lt_btnCancel"));
    };
    return this;
  };
})(jQuery);
function customFWRuleClicked(obj) {
  $("#firewallRule_error").html("");
  $("#firewallRule_error").hide();
  var index = $(obj).attr("name");
  for (var i = 0; i < _arrayTableDataCustomFW.length; i++) {
    var l = _arrayTableDataCustomFW[i];
    if (index == l[0]) {
      $("#divFirewallRuleDlg").show();
      setAddBoxHeigth("divFirewallRuleDlg");
      $("#lt_btnAdd").hide();
      $("#lt_btnSave").show();
      $("#txtRulename").val(l[1]);
      $("#txtRulename").attr("name", index);
      $("#txtRulename").attr("disabled", true);
      $("#txtRulename").addClass("dhcp_disabled");
      if (l[2] == "1") {
        $("#radio_enabled").prop("checked", true);
      } else {
        $("#radio_disabled").prop("checked", true);
      }
      var srcPort = l[4].split(":");
      $("#sourcePort1").val(srcPort[0]);
      $("#sourcePort2").val(srcPort[1]);
      if (l[3] == "" || l[3] == "NA" || l[3] == "N/A") {
        $("#sourceIP1").val("");
        $("#sourceIP2").val("");
        $("#sourceIP3").val("");
        $("#sourceIP4").val("");
        $("#sourceIP5").val("");
      } else {
        var srcIP = l[3].split(".");
        var srcip3 = srcIP[3];
        srcip3 = srcip3.split("/");
        $("#sourceIP1").val(srcIP[0]);
        $("#sourceIP2").val(srcIP[1]);
        $("#sourceIP3").val(srcIP[2]);
        $("#sourceIP4").val(srcip3[0]);
        $("#sourceIP5").val(srcip3[1]);
      }

      var desPort = l[6].split(":");
      $("#destinationPort1").val(desPort[0]);
      $("#destinationPort2").val(desPort[1]);
      if (l[5] == "" || l[5] == "NA" || l[5] == "N/A") {
        $("#destinationIP1").val("");
        $("#destinationIP2").val("");
        $("#destinationIP3").val("");
        $("#destinationIP4").val("");
        $("#destinationIP5").val("");
      } else {
        var desIP = l[5].split(".");
        var desip3 = desIP[3];
        desip3 = desip3.split("/");
        $("#destinationIP1").val(desIP[0]);
        $("#destinationIP2").val(desIP[1]);
        $("#destinationIP3").val(desIP[2]);
        $("#destinationIP4").val(desip3[0]);
        $("#destinationIP5").val(desip3[1]);
      }
      $("#fwdSelect").val(l[7]);
    }
  }
}
function deleteFirewallRule(obj) {
  var index = $(obj).attr("name");
  var jsonData = {};
  jsonData.custom_rules_list = {};
  jsonData.custom_rules_list.delete = "1";
  jsonData.custom_rules_list.index = index;
  for (var i = 0; i < _arrayTableDataCustomFW.length; i++) {
    var l = _arrayTableDataCustomFW[i];
    if (index == l[0]) {
      jsonData.custom_rules_list.rule_name = l[1];
    }
  }
  showWait();
  setTimeout(function () {
    postJSON("custom_fw", jsonData, function (data) {
      if (data.result != "success") {
        showMsgBox(
          jQuery.i18n.prop("mCustomFirewallRules"),
          jQuery.i18n.prop("dialog_message_qos_delete_ip_fail")
        );
      } else {
        $.objCustomFirewallRules().onLoad(false);
        $("#divFirewallRuleDlg").hide();
      }
    });
  }, 100);
}
function isValidRule(ip1, nm1, ports1, ip2, nm2, ports2) {
  var flag = 0;

  if (ip1 == "..." && ports1 == ":" && ip2 == "..." && ports2 == ":") flag = 5;

  if (ip1 != "...") {
    if (!isIPFULL(ip1, true)) flag = 1;
    if (!is_valid_netmask_num(nm1)) flag = 1;
  } else {
    if (nm1.length > 0) flag = 1;
  }
  if (ip2 != "...") {
    if (!isIPFULL(ip2, true)) flag = 2;
    if (!is_valid_netmask_num(nm2)) flag = 2;
  } else {
    if (nm2.length > 0) flag = 2;
  }

  if (ports1 != ":") {
    var port11 = ports1.split(":")[0];
    var port12 = ports1.split(":")[1];
    if (!(IsNumber(port11) && IsNumber(port12))) flag = 3;
    if (Number(port11) > 65535 || Number(port11) < 1) flag = 3;
    if (Number(port12) > 65535 || Number(port12) < 1) flag = 3;
    if (Number(port11) > Number(port12)) flag = 4;
  }

  if (ports2 != ":") {
    var port21 = ports2.split(":")[0];
    var port22 = ports2.split(":")[1];
    if (!(IsNumber(port21) && IsNumber(port22))) flag = 3;
    if (Number(port21) > 65535 || Number(port21) < 1) flag = 3;
    if (Number(port22) > 65535 || Number(port22) < 1) flag = 3;
    if (Number(port21) > Number(port22)) flag = 4;
  }

  return flag;
}
function is_valid_netmask_num(nm) {
  ret = true;
  if (nm.length > 0) {
    if (!IsNumber(nm)) ret = false;
    if (Number(nm) < 1 || Number(nm) > 32) ret = false;
  }
  return ret;
}
// -------------------------------------------------------------objPortFilter-----------------------------------------------------------------
var arrayPortFilterRules = [];
(function ($) {
  $.objPortFilter = function () {
    var that = this;
    var mtu_value;
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.btnEvent();
      }
      that.showData();
      setDlgStyle();
    };
    this.showData = function () {
      callJSON("port_filter", function (json) {
        var filter_mode = json.port_filter_mode;
        if (filter_mode == "1") {
          $("#radio_enabled").attr("checked", true);
        } else {
          $("#radio_disabled").attr("checked", true);
        }
        arrayPortFilterRules = [];
        for (var i = 0; i < json.port_filter_list.length; i++) {
          var l = json.port_filter_list[i];
          var ruleName = decodeURIComponent(l.rule_name);
          var protocol = l.protocol;
          var triggerPort = l.trigger_port;
          var responsePort = l.response_port;

          arrayPortFilterRules.push([
            l.index,
            ruleName,
            protocol,
            triggerPort,
            responsePort,
          ]);
        }
        that.loadTableData();
      });
    };
    this.loadTableData = function () {
      var bodyHTML = "";
      if (arrayPortFilterRules.length == 0) {
        bodyHTML =
          '<tr><td colspan="5">' +
          jQuery.i18n.prop("tableNoData") +
          "</td></tr>";
      } else {
        for (var i = 0; i < arrayPortFilterRules.length; i++) {
          var l = arrayPortFilterRules[i];
          bodyHTML +=
            '<tr><td name="' +
            l[0] +
            '"  onclick="PortFilterRuleClicked(this)" style="color:#05bda1;cursor:pointer;">' +
            l[1] +
            "</td><td>" +
            l[2] +
            "</td><td>" +
            l[3] +
            "</td><td>" +
            l[4] +
            '</td><td><sapn name="' +
            l[0] +
            '" onclick="deletePortFilterRule(this)" class="delete_spanBtn">&times;</span></td></tr>';
        }
      }
      $("#portFilterBody").html(bodyHTML);
    };
    this.btnEvent = function () {
      $("#addPortFilterclose").unbind("click");
      $("#addPortFilterclose").bind("click", function () {
        $("#divPortFilterDlg").hide();
      });

      $("#lt_btnCancel").unbind("click");
      $("#lt_btnCancel").bind("click", function () {
        $("#divPortFilterDlg").hide();
      });

      $("#triggerPort2").unbind("input");
      $("#triggerPort2").bind("input", function () {
        that.checkPort();
      });

      $("#txtRulename").unbind("input");
      $("#txtRulename").bind("input", function () {
        that.checkRuleName();
      });

      $("#responsePort2").unbind("input");
      $("#responsePort2").bind("input", function () {
        that.checkPort();
      });

      $("#btn_addPortFilter").unbind("click");
      $("#btn_addPortFilter").bind("click", function () {
        if (arrayPortFilterRules.length >= 8) {
          showMsgBox(
            jQuery.i18n.prop("mPortFilter"),
            jQuery.i18n.prop("OutPortFilterRange")
          );
          return;
        }
        $("input[type='text']").val("");
        $("#divPortFilterDlg").show();
        setAddBoxHeigth("divPortFilterDlg");
        $("#txtRulename").attr("disabled", false);
        $("#txtRulename").removeClass("dhcp_disabled");
        $("#portFilter_error").hide();
        $("#lt_btnAdd").show();
        $("#lt_btnSave").hide();
      });

      $("#btn_portFilterMode").unbind("click");
      $("#btn_portFilterMode").bind("click", function () {
        showWait();
        setTimeout(function () {
          var portFilterMode = $("#radio_enabled").is(":checked") ? "1" : "0";
          var jsonData = {};
          jsonData.port_filter_mode = portFilterMode;
          postJSON("port_filter", jsonData, function (data) {
            closeWait();
            if (data.result == "success") {
              showMsgBox(
                jQuery.i18n.prop("lt_portFilter_stcMode"),
                jQuery.i18n.prop("ls_save_time_success")
              );
            } else {
              showMsgBox(
                jQuery.i18n.prop("lt_portFilter_stcMode"),
                jQuery.i18n.prop("ls_save_time_failure")
              );
            }
            that.onLoad(false);
          });
        }, 100);
      });

      $("#lt_btnAdd").unbind("click");
      $("#lt_btnAdd").bind("click", function () {
        if (that.checkRuleName() && that.checkPort()) {
          var ruleName = $("#txtRulename").val();
          var trigger1 = $("#triggerPort1").val();
          var trigger2 = $("#triggerPort2").val();
          var response1 = $("#responsePort1").val();
          var response2 = $("#responsePort2").val();
          var protocol = $("#PortFilterProtocolSel").val();
          var triggerPort = trigger1 + ":" + trigger2;
          var responsePort = response1 + ":" + response2;
          for (var i = 0; i < arrayPortFilterRules.length; i++) {
            if (ruleName == arrayPortFilterRules[i][1]) {
              $("#portFilter_error").show();
              $("#portFilter_error").html(
                jQuery.i18n.prop("RuleName_ADDR_EXIST")
              );
              return false;
            }
          }

          if (response1 == "") {
            responsePort = "NA";
          }
          if (trigger1 == "") {
            triggerPort = "NA";
          }
          var jsonData = {};
          jsonData.port_filter_list = {};
          jsonData.port_filter_list.index = arrayPortFilterRules.length + "";
          jsonData.port_filter_list.rule_name = ruleName;
          jsonData.port_filter_list.protocol = protocol;
          jsonData.port_filter_list.trigger_port = triggerPort;
          jsonData.port_filter_list.response_port = responsePort;
          showWait();
          setTimeout(function () {
            postJSON("port_filter", jsonData, function (data) {
              if (data.result != "success") {
                showMsgBox(
                  jQuery.i18n.prop("mPortFilter"),
                  jQuery.i18n.prop("ls_save_time_failure")
                );
              } else {
                $("#divPortFilterDlg").hide();
                that.onLoad(false);
              }
            });
          }, 100);
        }
      });

      $("#lt_btnSave").unbind("click");
      $("#lt_btnSave").bind("click", function () {
        if (that.checkRuleName() && that.checkPort()) {
          var ruleName = $("#txtRulename").val();
          var trigger1 = $("#triggerPort1").val();
          var trigger2 = $("#triggerPort2").val();
          var response1 = $("#responsePort1").val();
          var response2 = $("#responsePort2").val();
          var protocol = $("#PortFilterProtocolSel").val();
          var triggerPort = trigger1 + ":" + trigger2;
          var responsePort = response1 + ":" + response2;

          if (response1 == "") {
            responsePort = "NA";
          }
          if (trigger1 == "") {
            triggerPort = "NA";
          }
          var jsonData = {};
          jsonData.port_filter_list = {};
          jsonData.port_filter_list.index = $("#txtRulename").attr("name");
          jsonData.port_filter_list.rule_name = ruleName;
          jsonData.port_filter_list.protocol = protocol;
          jsonData.port_filter_list.trigger_port = triggerPort;
          jsonData.port_filter_list.response_port = responsePort;
          showWait();
          setTimeout(function () {
            postJSON("port_filter", jsonData, function (data) {
              if (data.result != "success") {
                showMsgBox(
                  jQuery.i18n.prop("mPortFilter"),
                  jQuery.i18n.prop("ls_save_time_failure")
                );
              } else {
                $("#divPortFilterDlg").hide();
                that.onLoad(false);
              }
            });
          }, 100);
        }
      });
    };
    this.checkRuleName = function () {
      $("#portFilter_error").hide();
      var ruleName = $("#txtRulename").val();
      if (ruleName == "") {
        $("#portFilter_error").show();
        $("#portFilter_error").html(jQuery.i18n.prop("lEmptyName"));
        return false;
      }
      if (!deviceNameValidation(ruleName)) {
        $("#portFilter_error").show();
        $("#portFilter_error").html(
          jQuery.i18n.prop("lCustomFWSpecialCharsNotAllowed")
        );
        return false;
      }
      return true;
    };
    this.checkPort = function () {
      $("#portFilter_error").hide();
      var trigger1 = $("#triggerPort1").val();
      var trigger2 = $("#triggerPort2").val();
      var response1 = $("#responsePort1").val();
      var response2 = $("#responsePort2").val();
      if (trigger1 == "" || response1 == "") {
        $("#portFilter_error").show();
        $("#portFilter_error").html(jQuery.i18n.prop("lStartPortIsEmpty"));
        return false;
      }
      if (
        !CheckPortNum(trigger1) ||
        !CheckPortNum(trigger2) ||
        !CheckPortNum(response1) ||
        !CheckPortNum(response2)
      ) {
        $("#portFilter_error").show();
        $("#portFilter_error").html(jQuery.i18n.prop("lPortNumInvalide"));
        return false;
      }
      if (
        (trigger1 != "" && trigger2 == "") ||
        (trigger1 == "" && trigger2 != "")
      ) {
        $("#portFilter_error").show();
        $("#portFilter_error").html(jQuery.i18n.prop("lTriggerPortIncomplete"));
        return false;
      }
      if (
        (response1 != "" && response2 == "") ||
        (response1 == "" && response2 != "")
      ) {
        $("#portFilter_error").show();
        $("#portFilter_error").html(
          jQuery.i18n.prop("lResponsePortIncomplete")
        );
        return false;
      }
      if (trigger1 != "") {
        if (parseInt(trigger1) > parseInt(trigger2)) {
          $("#portFilter_error").show();
          $("#portFilter_error").html(jQuery.i18n.prop("lStartPortLarger"));
          return false;
        }
      }
      if (response1 != "") {
        if (parseInt(response1) > parseInt(response2)) {
          $("#portFilter_error").show();
          $("#portFilter_error").html(jQuery.i18n.prop("lStartPortLarger"));
          return false;
        }
      }
      return true;
    };
    this.displayControls = function () {
      $("#lt_portFilter_title").html(jQuery.i18n.prop("mPortFilter"));
      $("#p_portFilter_text").html(jQuery.i18n.prop("p_portFilter_text"));
      $("#lt_portFilterMode").html(jQuery.i18n.prop("lt_portFilter_stcMode"));
      $("#span_enabled").html(jQuery.i18n.prop("lt_optEnableSwitch"));
      $("#span_disabled").html(jQuery.i18n.prop("lt_optDisabledSwitch"));
      $("#btn_portFilterMode").val(jQuery.i18n.prop("lt_btnSave"));
      $("#btn_addPortFilter").val(
        jQuery.i18n.prop("lt_portFilter_btnAddPortFilterRules")
      );
      $("#th_ruleName").html(jQuery.i18n.prop("ltRuleName"));
      $("#th_protocol").html(jQuery.i18n.prop("ltProtocol"));
      $("#th_triggerPort").html(
        jQuery.i18n.prop("lt_portFilter_stcTriggerPort")
      );
      $("#th_responsePort").html(
        jQuery.i18n.prop("lt_portFilter_stcResponsePort")
      );
      $("#lt_portFilter_AddTitle").html(
        jQuery.i18n.prop("lt_portFilter_stcPortFilterDlgTitle")
      );
      $("#lt_ruleName").html(jQuery.i18n.prop("ltRuleName"));
      $("#lt_triggerPort").html(
        jQuery.i18n.prop("lt_portFilter_stcTriggerPort")
      );
      $("#lt_responsePort").html(
        jQuery.i18n.prop("lt_portFilter_stcResponsePort")
      );
      $("#lt_protocol").html(jQuery.i18n.prop("ltProtocol"));
      $("#lt_btnAdd").val(
        jQuery.i18n.prop("lt_portFilter_btnAddPortFilterRules")
      );
      $("#lt_btnSave").val(jQuery.i18n.prop("lt_btnSave"));
      $("#lt_btnCancel").val(jQuery.i18n.prop("lt_btnCancel"));
    };
    return this;
  };
})(jQuery);
function PortFilterRuleClicked(obj) {
  $("#portFilter_error").hide();
  var index = $(obj).attr("name");
  for (var i = 0; i < arrayPortFilterRules.length; i++) {
    var l = arrayPortFilterRules[i];
    if (l[0] == index) {
      $("#divPortFilterDlg").show();
      setAddBoxHeigth("divPortFilterDlg");
      $("#txtRulename").attr("disabled", true);
      $("#txtRulename").addClass("dhcp_disabled");
      $("#lt_btnAdd").hide();
      $("#lt_btnSave").show();
      $("#txtRulename").attr("name", index);
      var trigger = l[3].split(":");
      var response = l[4].split(":");
      $("#txtRulename").val(l[1]);
      $("#triggerPort1").val(trigger[0]);
      $("#triggerPort2").val(trigger[1]);
      $("#responsePort1").val(response[0]);
      $("#responsePort2").val(response[1]);
      $("#PortFilterProtocolSel").val(l[2]);
    }
  }
}
function deletePortFilterRule(obj) {
  var index = $(obj).attr("name");
  for (var i = 0; i < arrayPortFilterRules.length; i++) {
    var l = arrayPortFilterRules[i];
    if (l[0] == index) {
      var jsonData = {};
      jsonData.port_filter_list = {};
      jsonData.port_filter_list.delete = "1";
      jsonData.port_filter_list.index = l[0];
      jsonData.port_filter_list.rule_name = l[1];
      showWait();
      setTimeout(function () {
        postJSON("port_filter", jsonData, function (data) {
          if (data.result != "success") {
            showMsgBox(
              jQuery.i18n.prop("mPortFilter"),
              jQuery.i18n.prop("dialog_message_qos_delete_ip_fail")
            );
          } else {
            $.objPortFilter().onLoad(false);
          }
        });
      }, 100);
    }
  }
}
function CheckPortNum(strPortNum) {
  if (strPortNum == "") {
    return true;
  }
  if (!IsNumber(strPortNum)) {
    return false;
  }
  var portNum = parseInt(strPortNum);
  if (portNum < 1 || portNum > 65535) {
    return false;
  }
  return true;
}
// -------------------------------------------------------------objPortForwarding-----------------------------------------------------------------
var arrayPortForwardRules = [];
var portForwardDHCP = "";
(function ($) {
  $.objPortForwarding = function () {
    var that = this;
    var mtu_value;
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.btnEvent();
      }
      that.showData();
      setDlgStyle();
    };
    this.showData = function () {
      callJSON("port_forwarding", function (json) {
        var start = json.start;
        portForwardDHCP = json.start;
        start = start.split(".");
        $("#ip1").val(start[0]);
        $("#ip2").val(start[1]);
        $("#ip3").val(start[2]);

        if (json.pf_enable == "1") {
          $("#radio_enabled").attr("checked", true);
        } else {
          $("#radio_disabled").attr("checked", true);
        }
        arrayPortForwardRules = [];
        for (var i = 0; i < json.port_forwarding_list.length; i++) {
          var l = json.port_forwarding_list[i];
          arrayPortForwardRules.push([
            l.index,
            decodeURIComponent(l.rule_name),
            l.pw_ip,
            l.pw_port,
            l.protocol,
          ]);
        }
        that.loadTableData();
      });
    };
    this.loadTableData = function () {
      var bodyHTML = "";
      if (arrayPortForwardRules.length == 0) {
        bodyHTML =
          '<tr><td colspan="5">' +
          jQuery.i18n.prop("tableNoData") +
          "</td></tr>";
      } else {
        for (var i = 0; i < arrayPortForwardRules.length; i++) {
          var l = arrayPortForwardRules[i];
          bodyHTML +=
            '<tr><td name="' +
            l[0] +
            '"  onclick="PortForwardRuleClicked(this)" style="color:#05bda1;cursor:pointer;">' +
            l[1] +
            "</td><td>" +
            l[2] +
            "</td><td>" +
            l[3] +
            "</td><td>" +
            l[4] +
            '</td><td><sapn name="' +
            l[0] +
            '" onclick="deletePortForwardRule(this)" class="delete_spanBtn">&times;</span></td></tr>';
        }
      }
      $("#portForwardBody").html(bodyHTML);
    };
    this.checkRuleName = function () {
      $("#portForward_error").hide();
      var ruleName = $("#txtRulename").val();
      if (ruleName == "") {
        $("#portForward_error").show();
        $("#portForward_error").html(jQuery.i18n.prop("lEmptyName"));
        return false;
      }
      if (!deviceNameValidation(ruleName)) {
        $("#portForward_error").show();
        $("#portForward_error").html(
          jQuery.i18n.prop("lCustomFWSpecialCharsNotAllowed")
        );
        return false;
      }
      return true;
    };
    this.checkPort = function () {
      $("#portForward_error").hide();
      var port1 = $("#port1").val();
      var port2 = $("#port2").val();
      var ip = $("#ip4").val();
      if (port1 == "" || port2 == "") {
        $("#portForward_error").show();
        $("#portForward_error").html(jQuery.i18n.prop("lStartPortIsEmpty"));
        return false;
      }
      if (!CheckPortNum(port1) || !CheckPortNum(port2)) {
        $("#portForward_error").show();
        $("#portForward_error").html(jQuery.i18n.prop("lPortNumInvalide"));
        return false;
      }
      if ((port1 != "" && port2 == "") || (port1 == "" && port2 != "")) {
        $("#portForward_error").show();
        $("#portForward_error").html(
          jQuery.i18n.prop("lResponsePortIncomplete")
        );
        return false;
      }
      if (parseInt(port1) > parseInt(port2)) {
        $("#portForward_error").show();
        $("#portForward_error").html(jQuery.i18n.prop("lStartPortLarger"));
        return false;
      }

      if (ip == "") {
        $("#portForward_error").show();
        $("#portForward_error").html(
          jQuery.i18n.prop("lResponsePortIncomplete")
        );
        return false;
      }
      if (!IsNumber(ip)) {
        $("#portForward_error").show();
        $("#portForward_error").html(jQuery.i18n.prop("lIncorrectPWIP"));
        return false;
      }
      if (parseInt(ip) > 255 || parseInt(ip) < 1) {
        $("#portForward_error").show();
        $("#portForward_error").html(jQuery.i18n.prop("lIncorrectPWIP"));
        return false;
      }
      return true;
    };
    this.btnEvent = function () {
      $("#addPorForwardclose").unbind("click");
      $("#addPorForwardclose").bind("click", function () {
        $("#divPorForwardDlg").hide();
      });

      $("#lt_btnCancel").unbind("click");
      $("#lt_btnCancel").bind("click", function () {
        $("#divPorForwardDlg").hide();
      });

      $("#btn_addporForward").unbind("click");
      $("#btn_addporForward").bind("click", function () {
        if (arrayPortForwardRules.length >= 8) {
          showMsgBox(
            jQuery.i18n.prop("mPortForwarding"),
            jQuery.i18n.prop("OutPortForwardingRange")
          );
          return;
        }
        $("#divPorForwardDlg").show();
        setAddBoxHeigth("divPorForwardDlg");
        $("#txtRulename").val("");
        $("#port1").val("");
        $("#port2").val("");
        $("#ip4").val("");
        $("#txtRulename").attr("disabled", false);
        $("#txtRulename").removeClass("dhcp_disabled");
        $("#portForward_error").hide();
        $("#lt_btnAdd").show();
        $("#lt_btnSave").hide();
      });

      $("#btn_porForwardMode").unbind("click");
      $("#btn_porForwardMode").bind("click", function () {
        var porForwardMode = $("#radio_enabled").is(":checked") ? "1" : "0";
        var jsonData = {};
        jsonData.pf_enable = porForwardMode;
        showWait();
        setTimeout(function () {
          postJSON("port_forwarding", jsonData, function (data) {
            that.onLoad(false);
          });
        }, 100);
      });

      $("#port2").unbind("click");
      $("#port2").bind("click", function () {
        that.checkPort();
      });

      $("#txtRulename").unbind("input");
      $("#txtRulename").bind("input", function () {
        that.checkRuleName();
      });

      $("#lt_btnAdd").unbind("click");
      $("#lt_btnAdd").bind("click", function () {
        if (that.checkRuleName() && that.checkPort()) {
          var rulename = $("#txtRulename").val();
          var ipStart = portForwardDHCP.split(".");
          var ip =
            ipStart[0] +
            "." +
            ipStart[1] +
            "." +
            ipStart[2] +
            "." +
            $("#ip4").val();
          var port = $("#port1").val() + ":" + $("#port2").val();
          var protocol = $("#porForwardProtocolSel").val();
          var jsonData = {};
          for (var i = 0; i < arrayPortForwardRules.length; i++) {
            if (rulename == arrayPortForwardRules[i][1]) {
              $("#portForward_error").show();
              $("#portForward_error").html(
                jQuery.i18n.prop("RuleName_ADDR_EXIST")
              );
              return false;
            }
          }
          jsonData.port_forwarding_list = {};
          jsonData.port_forwarding_list.index =
            arrayPortForwardRules.length + "";
          jsonData.port_forwarding_list.rulename = rulename;
          jsonData.port_forwarding_list.pw_ip = ip;
          jsonData.port_forwarding_list.pw_port = port;
          jsonData.port_forwarding_list.protocol = protocol;
          showWait();
          setTimeout(function () {
            postJSON("port_forwarding", jsonData, function (data) {
              if (data.result != "success") {
                showMsgBox(
                  jQuery.i18n.prop("mPortForwarding"),
                  jQuery.i18n.prop("ls_save_time_failure")
                );
              } else {
                $("#divPorForwardDlg").hide();
                that.onLoad(false);
              }
            });
          }, 100);
        }
      });

      $("#lt_btnSave").unbind("click");
      $("#lt_btnSave").bind("click", function () {
        if (that.checkRuleName() && that.checkPort()) {
          var rulename = $("#txtRulename").val();
          var ipStart = portForwardDHCP.split(".");
          var ip =
            ipStart[0] +
            "." +
            ipStart[1] +
            "." +
            ipStart[2] +
            "." +
            $("#ip4").val();
          var port = $("#port1").val() + ":" + $("#port2").val();
          var protocol = $("#porForwardProtocolSel").val();
          var jsonData = {};
          jsonData.port_forwarding_list = {};
          jsonData.port_forwarding_list.index = $("#txtRulename").attr("name");
          jsonData.port_forwarding_list.rulename = rulename;
          jsonData.port_forwarding_list.pw_ip = ip;
          jsonData.port_forwarding_list.pw_port = port;
          jsonData.port_forwarding_list.protocol = protocol;
          showWait();
          setTimeout(function () {
            postJSON("port_forwarding", jsonData, function (data) {
              if (data.result != "success") {
                showMsgBox(
                  jQuery.i18n.prop("mPortForwarding"),
                  jQuery.i18n.prop("ls_save_time_failure")
                );
              } else {
                $("#divPorForwardDlg").hide();
                that.onLoad(false);
              }
            });
          }, 100);
        }
      });
    };
    this.displayControls = function () {
      $("#lt_porForward_title").html(jQuery.i18n.prop("mPortForwarding"));
      $("#lt_porForwardMode").html(jQuery.i18n.prop("lCustomPWRulesText"));
      $("#span_enabled").html(jQuery.i18n.prop("lt_optEnableSwitch"));
      $("#span_disabled").html(jQuery.i18n.prop("lt_optDisabledSwitch"));
      $("#btn_porForwardMode").val(jQuery.i18n.prop("lt_btnSave"));
      $("#btn_addporForward").val(jQuery.i18n.prop("btnAddAccessLogsRule"));
      $("#th_ruleName").html(jQuery.i18n.prop("ltRuleName"));
      $("#th_IP").html(jQuery.i18n.prop("lt_log_IPAddr"));
      $("#th_port").html(jQuery.i18n.prop("ltPWPort"));
      $("#th_protocol").html(jQuery.i18n.prop("ltProtocol"));
      $("#lt_porForward_AddTitle").html(jQuery.i18n.prop("mPortForwarding"));
      $("#lt_ruleName").html(jQuery.i18n.prop("ltRuleName"));
      $("#lt_IP").html(jQuery.i18n.prop("lt_log_IPAddr"));
      $("#lt_port").html(jQuery.i18n.prop("ltPWPort"));
      $("#lt_protocol").html(jQuery.i18n.prop("ltProtocol"));
      $("#lt_btnAdd").val(jQuery.i18n.prop("btnAddAccessLogsRule"));
      $("#lt_btnSave").val(jQuery.i18n.prop("lt_btnSave"));
      $("#lt_btnCancel").val(jQuery.i18n.prop("lt_btnCancel"));
    };
    return this;
  };
})(jQuery);
function ip4_rangeChanged() {
  var ip4 = $("#ip4").val();
  if (ip4 == "") {
    return false;
  }
  $("#ip4").val(parseInt(ip4));
}
function PortForwardRuleClicked(obj) {
  $("#portForward_error").hide();
  var index = $(obj).attr("name");
  for (var i = 0; i < arrayPortForwardRules.length; i++) {
    var l = arrayPortForwardRules[i];
    if (l[0] == index) {
      $("#divPorForwardDlg").show();
      setAddBoxHeigth("divPorForwardDlg");
      $("#txtRulename").attr("disabled", true);
      $("#txtRulename").addClass("dhcp_disabled");
      $("#lt_btnAdd").hide();
      $("#lt_btnSave").show();
      $("#txtRulename").attr("name", index);
      var ip = l[2];
      var port = l[3];
      ip = ip.split(".");
      port = port.split(":");
      $("#txtRulename").val(l[1]);
      $("#ip4").val(ip[3]);
      $("#port1").val(port[0]);
      $("#port2").val(port[1]);
      $("#porForwardProtocolSel").val(l[4]);
    }
  }
}
function deletePortForwardRule(obj) {
  var index = $(obj).attr("name");
  for (var i = 0; i < arrayPortForwardRules.length; i++) {
    var l = arrayPortForwardRules[i];
    if (l[0] == index) {
      var jsonData = {};
      jsonData.port_forwarding_list = {};
      jsonData.port_forwarding_list.delete = "1";
      jsonData.port_forwarding_list.index = l[0];
      jsonData.port_forwarding_list.rulename = l[1];
      showWait();
      setTimeout(function () {
        postJSON("port_forwarding", jsonData, function (data) {
          if (data.result != "success") {
            showMsgBox(
              jQuery.i18n.prop("mPortForwarding"),
              jQuery.i18n.prop("dialog_message_qos_delete_ip_fail")
            );
          } else {
            $.objPortForwarding().onLoad(false);
          }
        });
      }, 100);
    }
  }
}
// -------------------------------------------------------------objRouterManage-----------------------------------------------------------------
(function ($) {
  $.objRouterManage = function () {
    var that = this;
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.BtnClick();
      }
      setDlgStyle();
    };
    this.BtnClick = function () {
      $("#lt_rm_btnReboot").unbind("click");
      $("#lt_rm_btnReboot").bind("click", function () {
        showBOX2(
          jQuery.i18n.prop("lt_rm_title"),
          jQuery.i18n.prop("lt_rm_QueryRebootedRouter"),
          jQuery.i18n.prop("lt_btnOK"),
          jQuery.i18n.prop("lt_btnCancel"),
          function () {
            callJSON("device_restart", function () {
              showWait();
            });
            ClosemBOX2();
            showWait();
            afterRebootID = setInterval("afterRebootConf()", 30000);
          },
          function () {
            ClosemBOX2();
          }
        );
      });
      $("#lt_rm_btnResetFactory").unbind("click");
      $("#lt_rm_btnResetFactory").bind("click", function () {
        showBOX2(
          jQuery.i18n.prop("lt_rm_title"),
          jQuery.i18n.prop("lt_rm_QueryResetRouter"),
          jQuery.i18n.prop("lt_btnOK"),
          jQuery.i18n.prop("lt_btnCancel"),
          function () {
            callJSON("device_reset", function () {
              showWait();
            });
            ClosemBOX2();
            showWait();
            afterRebootID = setInterval("afterRebootConf()", 30000);
          },
          function () {
            ClosemBOX2();
          }
        );
      });
    };
    this.displayControls = function () {
      $("#lt_rm_title").html(jQuery.i18n.prop("lt_rm_title"));
      $("#lt_rm_reboot").html(jQuery.i18n.prop("lt_rm_reboot"));
      $("#lt_rm_resetFactory").html(jQuery.i18n.prop("lt_rm_resetFactory"));
      $("#lt_rm_btnReboot").val(jQuery.i18n.prop("lt_rm_btnReboot"));
      $("#lt_rm_btnResetFactory").val(
        jQuery.i18n.prop("lt_rm_btnResetFactory")
      );
    };
    return this;
  };
})(jQuery);
// -------------------------------------------------------------objAccountManage-----------------------------------------------------------------
function callXML(xmlName, callbackFun) {
  resetInterval();
  var url = "";
  var host = window.location.protocol + "//" + window.location.host + "/";
  var ctx;
  url = host + "xml_action.cgi?method=get&module=duster&file=" + xmlName;

  $.ajax({
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", getAuthHeader("GET"));
    },
    url: url,
    timeout: 30000,
    dataType: "xml",
    async: true,
    success: function (data, textStatus) {},
    complete: function (XMLHttpRequest, textStatus) {
      var firstNewSmsString = XMLHttpRequest.responseText;
      if (
        firstNewSmsString.indexOf("UNAUTHORIZED") > 0 ||
        firstNewSmsString.indexOf("KICKOFF") > 0
      ) {
        clearAuthheader();
      } else {
        if (callbackFun) {
          callbackFun(firstNewSmsString);
        }
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {},
  });
}
(function ($) {
  $.objAccountManage = function () {
    var that = this;
    var username = "";
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.showData();
        that.btnSave();
      }
      setDlgStyle();
    };
    this.showData = function () {
      callXML("admin", function (xml) {
        username = $(xml).find("router_username").text();
        console.log(username);
      });
    };
    this.btnSave = function () {
      $("#lt_btUpdate").unbind("click");
      $("#lt_btUpdate").bind("click", function () {
        if (that.checkPwd()) {
          showWait();
          var item_name = encodeURIComponent(username);
          var item_password = encodeURIComponent($("#txtNewPwd1").val());

          var jsonData = {};
          jsonData.account_action = "1";
          jsonData.account_username = username;
          jsonData.account_password = item_password;
          jsonData.router_user_list = {};
          jsonData.router_user_list.username = item_name;
          jsonData.router_user_list.password = item_password;
          jsonData.router_user_list.authority = "1";
          setTimeout(function () {
            postJSON("account_management", jsonData, function (data) {
              setTimeout(function () {
                window.location.href = "index.html";
              }, 100);
            });
          }, 100);
        }
      });
    };
    this.checkPwd = function () {
      $("#lAlertPasswordError").hide();
      var pwd1 = $("#txtNewPwd1").val();
      var pwd2 = $("#txtNewPwd2").val();
      var currentPwd = $("#txtCurrentPwd1").val();
      if (currentPwd != g_loginPasswd) {
        $("#lAlertPasswordError").html(jQuery.i18n.prop("lloginfailed"));
        $("#lAlertPasswordError").show();
        return false;
      } else if (pwd1 == "" || pwd2 == "") {
        $("#lAlertPasswordError").html(jQuery.i18n.prop("lPasswdIsEmpty"));
        $("#lAlertPasswordError").show();
        return false;
      } else if (pwd1 != pwd2) {
        $("#lAlertPasswordError").html(jQuery.i18n.prop("lPassErrorMes"));
        $("#lAlertPasswordError").show();
        return false;
      } else if (pwd1.indexOf(" ") >= 0) {
        $("#lAlertPasswordError").html(jQuery.i18n.prop("lPasswordError1"));
        $("#lAlertPasswordError").show();
        return false;
      } else if (pwd1.length < 4) {
        $("#lAlertPasswordError").html(
          jQuery.i18n.prop("lPasswordMinLengthError")
        );
        $("#lAlertPasswordError").show();
        return false;
      } else if (pwd1.length > 8) {
        $("#lAlertPasswordError").html(
          jQuery.i18n.prop("lPasswordMaxLengthError")
        );
        $("#lAlertPasswordError").show();
        return false;
      } else if (!deviceNameValidation(pwd1)) {
        $("#lAlertPasswordError").html(jQuery.i18n.prop("ErrAccountPwdChat"));
        $("#lAlertPasswordError").show();
        return false;
      }
      return true;
    };
    this.displayControls = function () {
      $("#lt_change_password_title").html(
        jQuery.i18n.prop("lt_change_password_title")
      );
      document.getElementById("lt_CurrentPassword").innerHTML =
        jQuery.i18n.prop("lt_CurrentPassword");
      document.getElementById("lt_EnterNewPassword1").innerHTML =
        jQuery.i18n.prop("lt_EnterNewPassword1");
      document.getElementById("lt_EnterNewPassword2").innerHTML =
        jQuery.i18n.prop("lt_EnterNewPassword2");
      $("#lt_btUpdate").val(jQuery.i18n.prop("lt_btUpdate"));
    };
    return this;
  };
})(jQuery);
// -------------------------------------------------------------objUpdate-----------------------------------------------------------------
var progressInterval;
(function ($) {
  $.objUpdate = function () {
    var that = this;
    var moveIndex = 0;
    this.bytesPerChunk = 100000;
    var _pixels = 0;
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.btnEvent();
      }
      that.showData();
      setDlgStyle();
    };
    this.showData = function () {
      callJSON("firmware", function (json) {
        $("#lt_value_software_version").html(json.version_num);
        $("#lt_value_hardware_version").html(json.hardware_version);
        $("#lt_value_date_version").html(json.version_date);
      });
    };
    this.btnEvent = function () {
      $("#yo_btn_browse").unbind("click");
      $("#yo_btn_browse").bind("click", function () {
        $("#softVersionUpdateFile").trigger("click");
      });

      $("#yo_update_cencelBtn").unbind("click");
      $("#yo_update_cencelBtn").bind("click", function () {
        $("#yo_btn_browse").show();
        $("#yo_update_fileName").hide();
        $("#yo_update_updateBtn").hide();
        $("#yo_update_cencelBtn").hide();
      });

      $("#softVersionUpdateFile").unbind("change");
      $("#softVersionUpdateFile").bind("change", function () {
        $("#yo_update_updateBtn").hide();
        $("#yo_update_cencelBtn").hide();
        if (document.getElementById("softVersionUpdateFile").value != "") {
          var filePath = $("#softVersionUpdateFile").val();
          var fileName = filePath.substring(filePath.lastIndexOf("\\") + 1);
          $("#yo_update_fileName").text(fileName);
          $("#yo_btn_browse").hide();
          $("#yo_update_fileName").show();
          $("#yo_update_updateBtn").show();
          $("#yo_update_cencelBtn").show();
          if (
            document
              .getElementById("softVersionUpdateFile")
              .value.toString()
              .lastIndexOf(".bin") == -1
          ) {
            $("#yo_update_updateBtn").attr("disabled", true);
            $("#yo_update_updateBtn").addClass("disBtn");
          } else {
            $("#yo_update_updateBtn").attr("disabled", false);
            $("#yo_update_updateBtn").removeClass("disBtn");
          }
        }
      });

      $("#yo_update_updateBtn").unbind("click");
      $("#yo_update_updateBtn").bind("click", function () {
        if (document.getElementById("softVersionUpdateFile").value != "") {
          if (
            document
              .getElementById("softVersionUpdateFile")
              .value.toString()
              .lastIndexOf(".bin") == -1
          ) {
            showMsgBox(
              jQuery.i18n.prop("mUpdate"),
              jQuery.i18n.prop("BinExtError")
            );
          } else {
            $("#yo_update_progress").show();
            $("#yo_update_updateBtn").hide();
            $("#yo_update_cencelBtn").hide();
            $("#yo_btn_browse").hide();
            try {
              var url;
              var host = window.location.protocol + "//" + window.location.host;
              url = host + getHeader("GET", "upgrade");

              document.getElementById("uploadFileForm").action = url;
              document.getElementById("uploadFileForm").target = "rfFrame";
              document.getElementById("uploadFileForm").submit();
              showWait();
              that.moveProgress();
              progressInterval = setInterval(function () {
                callJSON("manual_upgrade_progress", function (data) {
                  closeWait();
                  if (data.upgrade_status == "3") {
                    clearInterval(progressInterval);
                    $("#yo_btn_browse").show();
                    $("#yo_update_fileName").hide();
                    $("#yo_update_updateBtn").hide();
                    $("#yo_update_cencelBtn").hide();
                    showMsgBox(
                      jQuery.i18n.prop("mUpdate"),
                      jQuery.i18n.prop("lt_sw_UpgradeFailedWarningLine1")
                    );
                  } else if (data.upgrade_status == "1") {
                    that.progressRun(100);
                    clearInterval(progressInterval);
                    var successHTML =
                      '<div id="yo_success_text"></div><div style="margin-top:15px; text-align:center;"><input class="btn-apply" style="width:60px;" id="yo_btn_success_ok" /></div>';
                    showMsgBox(jQuery.i18n.prop("mUpdate"), successHTML);
                    $("#yo_success_text").html(
                      jQuery.i18n.prop("lt_sw_UpgradeSuccessWarningLine1") +
                        "<br>" +
                        jQuery.i18n.prop("lt_sw_UpgradeSuccessWarningLine2")
                    );
                    $("#yo_btn_success_ok").val(jQuery.i18n.prop("lt_btnOK"));
                    $("#yo_btn_success_ok").unbind("click");
                    $("#yo_btn_success_ok").bind("click", function () {
                      CloseDlg();
                    });
                  } else if (data.upgrade_status == "2") {
                    _pixels = parseInt(data.progress);
                    that.progressRun(_pixels);
                  }
                });
              }, 3000);
            } catch (e) {
              showMsgBox(
                jQuery.i18n.prop("mUpdate"),
                jQuery.i18n.prop("lt_sw_UpgradeFailedWarningLine1")
              );
            }
          }
        } else {
          showMsgBox(
            jQuery.i18n.prop("mUpdate"),
            jQuery.i18n.prop("lt_sw_binExtError")
          );
        }
      });
    };
    this.progressRun = function (prbValue) {
      var intValue = parseInt(prbValue, 10); // Convert to int
      var prbMax = 100;
      if (intValue > prbMax) return;
      $("#yo_update_progress").css("width", intValue + "%");
      $("#yo_update_progress_text").html(intValue + "%");
    };
    this.moveProgress = function () {
      setInterval(function () {
        if (moveIndex == 18) {
          moveIndex = 0;
        }
        $("#yo_update_progress_bg").css(
          "background-position-x",
          moveIndex + "px"
        );
        moveIndex++;
      }, 100);
    };
    this.displayControls = function () {
      $("#lt_commTraffic").html(jQuery.i18n.prop("mUpdate"));
      $("#lt_update_subTitle").html(jQuery.i18n.prop("lt_update_subTitle"));
      $("#lt_key_software_version").html(
        jQuery.i18n.prop("lt_sw_CurrentSoftVersion")
      );
      $("#lt_key_date_version").html(
        jQuery.i18n.prop("lt_sw_CurrentSoftwareDate")
      );
      $("#lt_key_hardware_version").html(
        jQuery.i18n.prop("lt_sw_hardwareVersion")
      );
      $("#yo_btn_browse").val(jQuery.i18n.prop("yo_btn_browse"));
      $("#yo_update_updateBtn").val(jQuery.i18n.prop("lt_sw_btnUpgrade"));
      $("#yo_update_cencelBtn").html(jQuery.i18n.prop("lt_btnCancel"));
    };
    return this;
  };
})(jQuery);
// -------------------------------------------------------------objConfManage-----------------------------------------------------------------
(function ($) {
  $.objConfManage = function () {
    var that = this;
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.btnEvent();
        that.saveConfiguration();
        that.UpdateCfgFile();
      }
      that.showData();
      setDlgStyle();
    };
    this.showData = function () {
      $("#confManage_btnUpdate").attr("disabled", true);
      $("#confManage_btnUpdate").addClass("disBtn");

      callJSON("log_management", function (json) {});
    };
    this.saveConfiguration = function () {
      $("#lt_cnf_btnExportCfgFile").unbind("click");
      $("#lt_cnf_btnExportCfgFile").bind("click", function () {
        var host = window.location.protocol + "//" + window.location.host;
        var url = host + "/upload/Mifi_device.cfg?" + getAuthHeaderEx("POST");
        $.download(
          url,
          "filename=config_save&format=xml&content=",
          "POST",
          function () {}
        );
      });
    };
    this.UpdateCfgFile = function () {
      $("#confManage_btnUpdate").unbind("click");
      $("#confManage_btnUpdate").bind("click", function () {
        var strCfgFileName = $("#updateCfgFile").val();
        if (strCfgFileName.indexOf(".bin") != strCfgFileName.length - 4) {
          return;
        }

        showBOX2(
          jQuery.i18n.prop("lt_cnf_title"),
          jQuery.i18n.prop("lt_cnf_lRebootingText") +
            "<br>" +
            jQuery.i18n.prop("lt_cnf_lRebootingText1"),
          jQuery.i18n.prop("lt_btnConfirmYes"),
          jQuery.i18n.prop("lt_btnConfirmNo"),
          function () {
            afterRebootID = setInterval("afterRebootConf()", 30000);
            showWait();
            ClosemBOX2();
            var host = window.location.protocol + "//" + window.location.host;
            var url = host + getHeader("GET", "config_backup");
            document.getElementById("uploadFileForm").action = url;
            document.getElementById("uploadFileForm").target = "rfFrame";
            document.getElementById("uploadFileForm").submit();
          },
          function () {
            ClosemBOX2();
          }
        );
      });
    };
    this.btnEvent = function () {
      $("#btn_openFile").unbind("click");
      $("#btn_openFile").bind("click", function () {
        $("#updateCfgFile").click();
      });

      $("#updateCfgFile").unbind("change");
      $("#updateCfgFile").bind("change", function () {
        var strCfgFileName = $("#updateCfgFile").val();
        if (strCfgFileName.indexOf(".bin") != strCfgFileName.length - 4) {
          $("#lFileFormatError").show();
          $("#lFileFormatError").text(
            jQuery.i18n.prop("lt_cnf_FileFormatError")
          );
          $("#confManage_btnUpdate").attr("disabled", true);
          $("#confManage_btnUpdate").addClass("disBtn");
        } else {
          $("#lFileFormatError").hide();
          $("#confManage_btnUpdate").attr("disabled", false);
          $("#confManage_btnUpdate").removeClass("disBtn");
        }
        $("#txtCfgFileName").html(strCfgFileName);
      });
    };
    this.displayControls = function () {
      $("#lt_confManage_title").html(jQuery.i18n.prop("lt_cnf_title"));
      $("#lt_cnf_importCfgFile1").html(
        jQuery.i18n.prop("lt_cnf_importCfgFile1")
      );
      $("#lt_cnf_importCfgFile2").html(
        jQuery.i18n.prop("lt_cnf_importCfgFile2")
      );
      $("#lt_cnf_importCfgFile3").html(
        jQuery.i18n.prop("lt_cnf_importCfgFile3")
      );
      $("#confManage_btnUpdate").val(jQuery.i18n.prop("btnUpdate"));
      $("#lt_cnf_EmportCfgFileText").html(
        jQuery.i18n.prop("lt_cnf_EmportCfgFileText")
      );
      $("#lt_cnf_btnExportCfgFile").html(
        jQuery.i18n.prop("lt_cnf_btnExportCfgFile")
      );
      $("#btn_openFile").val(jQuery.i18n.prop("lt_sw_btnBrowseFile"));
    };
    return this;
  };
})(jQuery);

// -------------------------------------------------------------objAPN-----------------------------------------------------------------
var arrayProfileList = [];
var enableApnIndex;
var currentTableDataRow;
var currentProfile;
(function ($) {
  $.objAPN = function () {
    var that = this;
    var mtu_value;
    var defaultData = { auto_apn: "" };
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.btnEvent();
      }
      that.showData();
      setDlgStyle();
    };
    this.showData = function () {
      callJSON("apn_profile", function (json) {
        arrayProfileList = [];
        for (var i = 0; i < json.profiles.length; i++) {
          var l = json.profiles[i];
          var arr = [
            l.index,
            l.rulename,
            l.connnum,
            l.pconnnum,
            l.enable,
            l.conn_type,
            l.default,
            l.secondary,
            l.apn,
            l.lte_apn,
            l.iptype,
            l.qci,
            l.authtype2g3,
            l.usr2g3,
            l.paswd2g3,
            l.authtype4g,
            l.usr4g,
            l.paswd4g,
            l.hastft,
          ];
          arrayProfileList.push(arr);
          if (l.enable == "1") {
            currentTableDataRow = l.index;
            currentProfile = arr;
          }
        }
        defaultData.auto_apn = json.auto_apn;
        $("#btn_delAPN").hide();
        $("#btn_edit_profile").hide();
        $("#btn_set_as_default").hide();
        $("#profiles_select").html("");
        $("#profiles_select").html("");
        var optionH = "";
        if (arrayProfileList.length > 0) {
          for (var j = 0; j < arrayProfileList.length; j++) {
            var k = arrayProfileList[j];
            var Rulename = k[1];
            if (k[4] == "1") {
              optionH +=
                '<option value="' +
                k[0] +
                '">' +
                Rulename +
                "(" +
                jQuery.i18n.prop("lCurrent") +
                ")</option>";
            } else {
              optionH +=
                '<option value="' + k[0] + '">' + Rulename + "</option>";
            }
          }
          $("#profiles_select").html(optionH);
          $("#profiles_select").val(currentTableDataRow);
        }
        if (json.auto_apn == "1") {
          $("#radio_enabled").prop("checked", true);
        } else {
          $("#radio_disabled").prop("checked", true);
        }
        that.showCurrentAPN();
      });
    };
    this.btnEvent = function () {
      $("#lt_btnCancel").unbind("click");
      $("#lt_btnCancel").bind("click", function () {
        $("#divAPNDlg").hide();
      });

      $("#addAPNclose").unbind("click");
      $("#addAPNclose").bind("click", function () {
        $("#divAPNDlg").hide();
      });

      $("#btn_addAPN").unbind("click");
      $("#btn_addAPN").bind("click", function () {
        if (arrayProfileList.length >= 10) {
          showMsgBox(
            jQuery.i18n.prop("mAPN"),
            jQuery.i18n.prop("lt_pdp_max_length")
          );
        } else {
          $("#apnContent input[type='text']").val("");
          $("#apnContent input[type='password']").val("");
          $("#apnContent input").attr("disabled", false);
          $("#apnContent select").attr("disabled", false);
          $("#apnContent input").css("backgroundColor", "#fff");
          $("#apnContent select").css("backgroundColor", "#fff");
          $("#btn_edit_profile").hide();
          $("#btn_add_profile").show();
          $("#divAPNDlg").show();
          $("#lPdpSetError").hide();
          setAddBoxHeigth("divAPNDlg");
        }
      });

      $("#lt_internetPDP").unbind("click");
      $("#lt_internetPDP").bind("click", function () {
        var index = $("#profiles_select").val();
        for (var i = 0; i < arrayProfileList.length; i++) {
          var l = arrayProfileList[i];
          if (index == l[0]) {
            $("#pdp_iptype").val(l[10]);
            $("#profile_name").val(l[1]);
            $("#profile_name").attr("name", l[0]);
            $("#apn").val(l[8]);

            $("#authenticationtype").val(l[12]);
            $("#username").val(l[16]);
            $("#password").val(l[17]);

            if (l[6] == "1" || l[0] === currentTableDataRow) {
              $("#apnContent input").attr("disabled", true);
              $("#apnContent select").attr("disabled", true);
              $("#apnContent input").css("backgroundColor", "#ddd");
              $("#apnContent select").css("backgroundColor", "#ddd");
              $("#lPdpSetError").hide();
              $("#btn_add_profile").hide();
              $("#btn_edit_profile").hide();
            } else {
              $("#apnContent input").attr("disabled", false);
              $("#apnContent select").attr("disabled", false);
              $("#apnContent input").css("backgroundColor", "#fff");
              $("#apnContent select").css("backgroundColor", "#fff");
              $("#profile_name").attr("disabled", true);
              $("#profile_name").css("backgroundColor", "#ddd");
              $("#lPdpSetError").hide();
              $("#btn_add_profile").hide();
              $("#btn_edit_profile").show();
            }
          }
        }
        $("#divAPNDlg").show();
        setAddBoxHeigth("divAPNDlg");
      });

      $("#profiles_select").unbind("change");
      $("#profiles_select").bind("change", function () {
        that.changeAPN();
      });

      $("#profile_name").unbind("input");
      $("#profile_name").bind("input", function () {
        that.checkProfileName();
      });

      $("#apn").unbind("input");
      $("#apn").bind("input", function () {
        that.checkAPN();
      });

      $("#username").unbind("input");
      $("#username").bind("input", function () {
        that.checkUsername();
      });

      $("#password").unbind("input");
      $("#password").bind("input", function () {
        that.checkPassword();
      });

      $("#btn_APNSave").unbind("click");
      $("#btn_APNSave").bind("click", function () {
        var autoAPN = $("#radio_enabled").is(":checked") ? "1" : "0";
        var jsonData = {};
        var jsonData_dis = {};
        jsonData.auto_apn = autoAPN;
        jsonData.auto_apn_action = "1";
        jsonData_dis.auto_apn = autoAPN;
        jsonData_dis.auto_apn_action = "1";
        showWait();
        setTimeout(function () {
          postJSON("apn_profile", jsonData_dis, function (data) {
            showWait();
            postJSON("apn_profile", jsonData, function (data1) {
              that.onLoad(false);
            });
          });
        }, 100);
      });

      $("#btn_set_as_default").unbind("click");
      $("#btn_set_as_default").bind("click", function () {
        var autoAPN = $("#radio_enabled").is(":checked") ? "1" : "0";
        var apnIndex = $("#profiles_select").val();
        var jsonData = {};

        // jsonData.auto_apn=autoAPN;
        // jsonData.auto_apn_action="1";

        jsonData.pdp_supported_list = {};
        jsonData.pdp_supported_list.enable = "1";

        for (var i = 0; i < arrayProfileList.length; i++) {
          var l = arrayProfileList[i];
          if (l[0] == apnIndex) {
            jsonData.profile_list1 = {};
            jsonData.profile_list1.index = apnIndex;
            jsonData.profile_list1.enable = "1";
            jsonData.profile_list1.profile_name = l[1];
            jsonData.profile_list1.connnum = "1";
            jsonData.profile_list1.pconnnum = "1";
            jsonData.profile_list1.conntype = "0";
            jsonData.profile_list1.default = l[6];
            jsonData.profile_list1.secondary = "1";
            jsonData.profile_list1.apn = l[8];
            jsonData.profile_list1.lte_apn = l[9];
            jsonData.profile_list1.iptype = l[10];
            jsonData.profile_list1.qci = "0";
            jsonData.profile_list1.authtype2g3 = l[12];
            jsonData.profile_list1.usr2g3 = l[13];
            jsonData.profile_list1.paswd2g3 = l[14];
            jsonData.profile_list1.authtype4g = l[15];
            jsonData.profile_list1.usr4g = l[16];
            jsonData.profile_list1.paswd4g = l[17];
            jsonData.profile_list1.hastft = "0";

            jsonData.pdp_supported_list.index = "1";
            jsonData.pdp_supported_list.rulename = "PDN1";
            jsonData.pdp_supported_list.connnum = "1";
            jsonData.pdp_supported_list.pconnnum = "1";
            jsonData.pdp_supported_list.conntype = "0";
            jsonData.pdp_supported_list.default = "1";
            jsonData.pdp_supported_list.secondary = "1";
            jsonData.pdp_supported_list.apn = l[8];
            jsonData.pdp_supported_list.lte_apn = l[9];
            jsonData.pdp_supported_list.iptype = l[10];
            jsonData.pdp_supported_list.qci = "0";
            jsonData.pdp_supported_list.authtype2g3 = l[12];
            jsonData.pdp_supported_list.usr2g3 = l[13];
            jsonData.pdp_supported_list.paswd2g3 = l[14];
            jsonData.pdp_supported_list.authtype4g = l[15];
            jsonData.pdp_supported_list.usr4g = l[16];
            jsonData.pdp_supported_list.paswd4g = l[17];
            jsonData.pdp_supported_list.hastft = "0";
          } else if (l[4] == "1") {
            jsonData.profile_list = {};
            jsonData.profile_list.enable = "0";
            jsonData.profile_list.index = l[0];
            jsonData.profile_list.profile_name = l[1];
            jsonData.profile_list.connnum = "1";
            jsonData.profile_list.pconnnum = "1";
            jsonData.profile_list.conntype = "0";
            jsonData.profile_list.default = l[6];
            jsonData.profile_list.secondary = "1";
            jsonData.profile_list.apn = l[8];
            jsonData.profile_list.lte_apn = l[9];
            jsonData.profile_list.iptype = l[10];
            jsonData.profile_list.qci = "0";
            jsonData.profile_list.authtype2g3 = l[12];
            jsonData.profile_list.usr2g3 = l[13];
            jsonData.profile_list.paswd2g3 = l[14];
            jsonData.profile_list.authtype4g = l[15];
            jsonData.profile_list.usr4g = l[16];
            jsonData.profile_list.paswd4g = l[17];
            jsonData.profile_list.hastft = "0";
          }
        }
        showWait();
        setTimeout(function () {
          postJSON("apn_profile", jsonData, function (data) {
            that.onLoad(false);
          });
        }, 100);
      });

      $("#btn_delAPN").unbind("click");
      $("#btn_delAPN").bind("click", function () {
        var apnIndex = $("#profiles_select").val();
        var isCheck = false;
        var jsonData = {};
        jsonData.profile_action = "delete";
        jsonData.profile_list = {};
        for (var i = 0; i < arrayProfileList.length; i++) {
          var l = arrayProfileList[i];
          if (l[0] == apnIndex) {
            if (l[6] != "1") {
              jsonData.profile_list.index = apnIndex;
              jsonData.profile_list.profile_name = l[1];
              jsonData.profile_list.delete = "1";
            }
          }
        }
        showWait();
        setTimeout(function () {
          postJSON("apn_profile", jsonData, function (data) {
            that.onLoad(false);
          });
        }, 100);
      });

      $("#btn_add_profile").unbind("click");
      $("#btn_add_profile").bind("click", function () {
        if (
          that.checkProfileName("add") &&
          that.checkAPN("add") &&
          that.checkUsername("add") &&
          that.checkPassword("add")
        ) {
          var authType = $("#authenticationtype").val();
          var profileName = $("#profile_name").val();
          var apn = $("#apn").val();
          var iptype = $("#pdp_iptype").val();
          var username = $("#username").val();
          var password = $("#password").val();
          if (authType == "NONE") {
            username = username;
            password = password;
          }
          var jsonData = {};
          jsonData.profile_action = "add";
          jsonData.profile_list = {};
          jsonData.profile_list.index = arrayProfileList.length;
          jsonData.profile_list.profile_name = profileName;
          jsonData.profile_list.connnum = "1";
          jsonData.profile_list.pconnnum = "1";
          jsonData.profile_list.enable = "0";
          jsonData.profile_list.conntype = "0";
          jsonData.profile_list.default = "0";
          jsonData.profile_list.secondary = "1";
          jsonData.profile_list.apn = apn;
          jsonData.profile_list.lte_apn = apn;
          jsonData.profile_list.iptype = iptype;
          jsonData.profile_list.qci = "0";
          jsonData.profile_list.authtype2g3 = authType;
          jsonData.profile_list.usr2g3 = username;
          jsonData.profile_list.paswd2g3 = password;
          jsonData.profile_list.authtype4g = authType;
          jsonData.profile_list.usr4g = username;
          jsonData.profile_list.paswd4g = password;
          jsonData.profile_list.hastft = "0";
          showWait();
          setTimeout(function () {
            postJSON("apn_profile", jsonData, function (data) {
              if (data.result != "success") {
                showMsgBox(
                  jQuery.i18n.prop("mAPN"),
                  jQuery.i18n.prop("ls_save_time_failure")
                );
              } else {
                $("#divAPNDlg").hide();
                that.onLoad(false);
              }
            });
          }, 100);
        }
      });

      $("#btn_edit_profile").unbind("click");
      $("#btn_edit_profile").bind("click", function () {
        var apnIndex = $("#profiles_select").val();
        var k = [];
        for (var i = 0; i < arrayProfileList.length; i++) {
          if (arrayProfileList[i][0] == apnIndex) {
            k = arrayProfileList[i];
          }
        }
        var jsonData = {};
        jsonData.profile_action = "edit";
        if ("1" !== k[6]) {
          if (
            that.checkProfileName("edit") &&
            that.checkAPN("edit") &&
            that.checkUsername("edit") &&
            that.checkPassword("edit")
          ) {
            var authType = $("#authenticationtype").val();
            var profileName = $("#profile_name").val();
            var apn = $("#apn").val();
            var iptype = $("#pdp_iptype").val();
            var username = $("#username").val();
            var password = $("#password").val();
            if (authType == "NONE") {
              username = username;
              password = username;
            }
            jsonData.profile_list = {};
            jsonData.profile_list.index = $("#profile_name").attr("name");
            jsonData.profile_list.profile_name = profileName;
            jsonData.profile_list.connnum = "1";
            jsonData.profile_list.pconnnum = "1";
            jsonData.profile_list.conntype = "0";
            jsonData.profile_list.default = "0";
            jsonData.profile_list.secondary = "1";
            jsonData.profile_list.apn = apn;
            jsonData.profile_list.lte_apn = apn;
            jsonData.profile_list.iptype = iptype;
            jsonData.profile_list.qci = "0";
            jsonData.profile_list.authtype2g3 = authType;
            jsonData.profile_list.usr2g3 = username;
            jsonData.profile_list.paswd2g3 = password;
            jsonData.profile_list.authtype4g = authType;
            jsonData.profile_list.usr4g = username;
            jsonData.profile_list.paswd4g = password;
            jsonData.profile_list.hastft = "0";

            for (var j = 0; j < arrayProfileList.length; j++) {
              var l = arrayProfileList[j];
              if (l[0] == $("#profile_name").attr("name")) {
                jsonData.profile_list.enable = l[4];
              }
            }
          }
        }
        showWait();
        setTimeout(function () {
          postJSON("apn_profile", jsonData, function (data1) {
            $("#divAPNDlg").hide();
            that.onLoad(false);
          });
        }, 100);
      });
    };
    this.changeAPN = function () {
      $("#btn_delAPN").hide();
      $("#btn_edit_profile").hide();
      $("#btn_set_as_default").hide();
      that.showCurrentAPN();
    };
    this.showCurrentAPN = function () {
      var index = $("#profiles_select").val();
      for (var i = 0; i < arrayProfileList.length; i++) {
        var l = arrayProfileList[i];
        if (index == l[0]) {
          if (l[6] == "1" && defaultData.auto_apn == "1") {
            $("#btn_delAPN").hide();
            $("#btn_edit_profile").hide();
            $("#btn_set_as_default").show();
          } else if (
            l[6] == "1" &&
            defaultData.auto_apn == "0" &&
            l[0] != currentTableDataRow
          ) {
            $("#btn_delAPN").hide();
            $("#btn_edit_profile").hide();
            $("#btn_set_as_default").show();
          } else if (
            l[6] == "1" &&
            defaultData.auto_apn == "0" &&
            l[0] == currentTableDataRow
          ) {
            $("#btn_delAPN").hide();
            $("#btn_edit_profile").hide();
            $("#btn_set_as_default").show();
          } else if (
            defaultData.auto_apn == "1" &&
            l[0] === currentTableDataRow
          ) {
            $("#btn_delAPN").hide();
            $("#btn_edit_profile").hide();
            $("#btn_set_as_default").show();
          } else if (l[0] == currentTableDataRow) {
            $("#btn_delAPN").hide();
            $("#btn_edit_profile").hide();
            $("#btn_set_as_default").hide();
          } else {
            $("#btn_delAPN").show();
            $("#btn_edit_profile").show();
            $("#btn_set_as_default").show();
          }
        }
      }
    };
    this.checkProfileName = function () {
      $("#lPdpSetError").hide();
      var profileName = $("#profile_name").val();
      if (!validateRuleName(profileName)) {
        $("#lPdpSetError").show();
        $("#lPdpSetError").html(jQuery.i18n.prop("EMPTY_PROFILE_NAME"));
        return false;
      }
      return true;
    };
    this.checkAPN = function () {
      $("#lPdpSetError").hide();
      var apn = $("#apn").val();
      if (!validateRuleName(apn)) {
        $("#lPdpSetError").show();
        $("#lPdpSetError").html(jQuery.i18n.prop("EMPTY_APN_NAME"));
        return false;
      }
      return true;
    };
    this.checkUsername = function () {
      $("#lPdpSetError").hide();
      var username = $("#username").val();
      if (IsChineseChar(username)) {
        $("#lPdpSetError").show();
        $("#lPdpSetError").html(jQuery.i18n.prop("lloginUsernameInvalide"));
        return false;
      }
      return true;
    };
    this.checkPassword = function () {
      $("#lPdpSetError").hide();
      var password = $("#password").val();
      if (IsChineseChar(password)) {
        $("#lPdpSetError").show();
        $("#lPdpSetError").html(jQuery.i18n.prop("lInvalidPassword"));
        return false;
      }
      return true;
    };
    this.displayControls = function () {
      $("#lt_apn_title").html(jQuery.i18n.prop("mAPN"));
      $("#lt_APN_AddTitle").html(jQuery.i18n.prop("mAPN"));
      $("#auto_apn").html(jQuery.i18n.prop("lt_interCon_autoApn"));
      $("#span_enabled").html(jQuery.i18n.prop("lt_optEnableSwitch"));
      $("#sapn_disabled").html(jQuery.i18n.prop("lt_optDisabledSwitch"));
      $("#btn_APNSave").val(jQuery.i18n.prop("lt_btnSave"));
      $("#btn_set_as_default").val(jQuery.i18n.prop("btn_set_as_default"));
      $("#lt_apnProfileNmae").html(
        jQuery.i18n.prop("lt_interCon_PdpProfileName")
      );
      $("#lt_apnSetting").html(jQuery.i18n.prop("lt_interCon_pdpList"));
      $("#lt_internetPDP").html(jQuery.i18n.prop("lt_interCon_pdpList"));
      $("#btn_addAPN").html(jQuery.i18n.prop("lt_interCon_addPdpProfile"));
      $("#btn_delAPN").html(jQuery.i18n.prop("lt_interCon_delPdpProfile"));
      $("#nconpt").html(jQuery.i18n.prop("lt_interCon_PdpType"));
      $("#dropdown_IPV4").html(jQuery.i18n.prop("lt_interCon_OptIPV4"));
      $("#dropdown_IPV6").html(jQuery.i18n.prop("lt_interCon_OptIPV6"));
      $("#dropdown_IPV4V6").html(jQuery.i18n.prop("lt_interCon_OptIPV4V6"));
      $("#nconpn").html(jQuery.i18n.prop("ltProfilename"));
      $("#nconapn").html(jQuery.i18n.prop("ltAPNname"));
      $("#nconauth").html(jQuery.i18n.prop("lt_interCon_2G3GAuthType"));
      $("#ncon_none").html(jQuery.i18n.prop("lt_vpn_protocol_none"));
      $("#ncon_pap").html(jQuery.i18n.prop("lt_apnAuth_pap"));
      $("#ncon_chap").html(jQuery.i18n.prop("lt_apnAuth_chap"));
      $("#nconuname").html(jQuery.i18n.prop("lCUsername"));
      $("#nconpass").html(jQuery.i18n.prop("lCPassword"));
      $("#btn_add_profile").val(jQuery.i18n.prop("lt_btnSave"));
      $("#btn_edit_profile").val(jQuery.i18n.prop("lt_btnSave"));
      $("#lt_btnCancel").val(jQuery.i18n.prop("lt_btnCancel"));
    };
    return this;
  };
})(jQuery);

function validateRuleName(Rulename) {
  if (!Rulename || Rulename == "") {
    return false;
  }

  if (IsChineseChar(Rulename)) {
    return false;
  }

  if (Rulename.toString().indexOf("%") != -1) return false;
  else if (Rulename.toString().indexOf("^") != -1) return false;
  else if (Rulename.toString().indexOf(";") != -1) return false;

  return true;
}
// -------------------------------------------------------------objTimeSetting-----------------------------------------------------------------
var g_bNtpEnabled;
(function ($) {
  $.objTimeSetting = function () {
    var that = this;
    this.onLoad = function (flag) {
      if (flag) {
        that.displayControls();
        that.btnEvent();
      }
      that.showData();
      setDlgStyle();
    };
    this.showData = function () {
      callJSON("time_setting", function (json) {
        $("#txt_year").val(json.year);
        $("#txt_month").val(json.month);
        $("#txt_day").val(json.day);
        $("#txt_hh").val(json.hour);
        $("#txt_mm").val(json.minute);
        $("#txt_ss").val(json.second);
        if (json.ntp_status == "enable") {
          g_bNtpEnabled = true;
          $("#radio_enabled").attr("checked", true);
        } else {
          g_bNtpEnabled = false;
          $("#radio_disabled").attr("checked", true);
        }
      });
    };
    this.btnEvent = function () {
      $("#btn_save").unbind("click");
      $("#btn_save").bind("click", function () {
        var year = $("#txt_year").val();
        var month = $("#txt_month").val();
        var day = $("#txt_day").val();
        var hour = $("#txt_hh").val();
        var minute = $("#txt_mm").val();
        var second = $("#txt_ss").val();
        if (that.time_validate(year, month, day, hour, minute, second)) {
          var jsonData = {};
          jsonData.year = year;
          jsonData.month = month;
          jsonData.day = day;
          jsonData.hour = hour;
          jsonData.minute = minute;
          jsonData.second = second;
          if ($("#radio_enabled").is(":checked")) {
            jsonData.ntp_status = "enable";
            if (g_bNtpEnabled) {
              jsonData.ntp_action = "noaction";
            } else {
              jsonData.ntp_action = "enable";
            }
          } else {
            jsonData.ntp_status = "disable";
            if (!g_bNtpEnabled) {
              jsonData.ntp_action = "noaction";
            } else {
              jsonData.ntp_action = "disable";
            }
          }
          showWait();
          setTimeout(function () {
            postJSON("time_setting", jsonData, function (data) {
              if (data.result != "success") {
                showMsgBox(
                  jQuery.i18n.prop("mTimeSetting"),
                  jQuery.i18n.prop("mTimeSetting")
                );
              } else {
                that.onLoad(false);
              }
            });
          }, 100);
        }
      });
    };
    this.time_validate = function (year, month, day, hour, minute, second) {
      $("#time_error").hide();
      if (year == "") {
        $("#time_error").show();
        $("#time_error").html(jQuery.i18n.prop("lEmptyYear"));
        return false;
      }
      if (month == "") {
        $("#time_error").show();
        $("#time_error").html(jQuery.i18n.prop("lEmptyMonth"));
        return false;
      }
      if (day == "") {
        $("#time_error").show();
        $("#time_error").html(jQuery.i18n.prop("lEmptyDay"));
        return false;
      }
      if (hour == "") {
        $("#time_error").show();
        $("#time_error").html(jQuery.i18n.prop("lEmptyHour"));
        return false;
      }
      if (minute == "") {
        $("#time_error").show();
        $("#time_error").html(jQuery.i18n.prop("lEmptyMinute"));
        return false;
      }
      if (second == "") {
        $("#time_error").show();
        $("#time_error").html(jQuery.i18n.prop("lEmptySecond"));
        return false;
      }

      if (!IsNumber(year) || year < 1970 || year > 2100) {
        $("#time_error").show();
        $("#time_error").html(jQuery.i18n.prop("lYearNumErr"));
        return false;
      }
      if (year.length > 4) {
        $("#time_error").show();
        $("#time_error").html(jQuery.i18n.prop("lYearLenErr"));
        return false;
      }
      if (!IsNumber(month)) {
        $("#time_error").show();
        $("#time_error").html(jQuery.i18n.prop("lMonthNumErr"));
        return false;
      }
      if (month.length > 2) {
        $("#time_error").show();
        $("#time_error").html(jQuery.i18n.prop("lMonthLenErr"));
        return false;
      }
      if (month > 12 || month <= 0) {
        $("#time_error").show();
        $("#time_error").html(jQuery.i18n.prop("lMonthLenErr"));
        return false;
      }
      if (!IsNumber(day)) {
        $("#time_error").show();
        $("#time_error").html(jQuery.i18n.prop("lDayNumErr"));
        return false;
      }
      if (day.length > 2 || day == 0) {
        $("#time_error").show();
        $("#time_error").html(jQuery.i18n.prop("lDayRangeErr"));
        return false;
      }
      if (month == 2) {
        if (is_leapyear(year)) {
          if (day > 29) {
            $("#time_error").show();
            $("#time_error").html(jQuery.i18n.prop("lDayRangeLeap"));
            return false;
          }
        } else {
          if (day > 28) {
            $("#time_error").show();
            $("#time_error").html(jQuery.i18n.prop("lDayRangeNonLeap"));
            return false;
          }
        }
      } else if (month <= 7) {
        if (month % 2 == 1) {
          if (day > 31) {
            $("#time_error").show();
            $("#time_error").html(jQuery.i18n.prop("lDayRangeErr"));
            return false;
          }
        } else {
          if (day > 30) {
            $("#time_error").show();
            $("#time_error").html(jQuery.i18n.prop("lDayRangeErr1"));
            return false;
          }
        }
      } else if (month > 7) {
        if (month % 2 == 0) {
          if (day > 31) {
            $("#time_error").show();
            $("#time_error").html(jQuery.i18n.prop("lDayRangeErr"));
            return false;
          }
        } else {
          if (day > 30) {
            $("#time_error").show();
            $("#time_error").html(jQuery.i18n.prop("lDayRangeErr1"));
            return false;
          }
        }
      }

      if (day > 31 || day < 1) {
        $("#time_error").show();
        $("#time_error").html(jQuery.i18n.prop("lDayRangeErr"));
        return false;
      }
      if (!IsNumber(hour)) {
        $("#time_error").show();
        $("#time_error").html(jQuery.i18n.prop("lHourNumErr"));
        return false;
      }
      if (hour > 23 || hour < 0) {
        $("#time_error").show();
        $("#time_error").html(jQuery.i18n.prop("lHourRangeErr"));
        return false;
      }
      if (!IsNumber(minute)) {
        $("#time_error").show();
        $("#time_error").html(jQuery.i18n.prop("lMinuteNumErr"));
        return false;
      }
      if (minute > 59 || minute < 0) {
        $("#time_error").show();
        $("#time_error").html(jQuery.i18n.prop("lMinuteRangeErr"));
        return false;
      }
      if (!IsNumber(second)) {
        $("#time_error").show();
        $("#time_error").html(jQuery.i18n.prop("lSecondNumErr"));
        return false;
      }
      if (second > 59 || second < 0) {
        $("#time_error").show();
        $("#time_error").html(jQuery.i18n.prop("lSecondRangeErr"));
        return false;
      }
      return true;
    };
    this.displayControls = function () {
      $("#lt_timeSetting_title").html(jQuery.i18n.prop("mTimeSetting"));
      $("#lt_yymmdd").html(jQuery.i18n.prop("lt_yymmdd"));
      $("#lt_hhmmss").html(jQuery.i18n.prop("lt_hhmmss"));
      $("#lt_ntpStatus").html(jQuery.i18n.prop("lt_ntpStatus"));
      $("#span_enabled").html(jQuery.i18n.prop("lt_optEnableSwitch"));
      $("#span_disabled").html(jQuery.i18n.prop("lt_optDisabledSwitch"));
      $("#btn_save").val(jQuery.i18n.prop("lt_btnSave"));
    };
    return this;
  };
})(jQuery);
function is_leapyear(year) {
  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) return true;
  else return false;
}
