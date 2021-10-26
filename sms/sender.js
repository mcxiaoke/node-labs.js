const { log, loge } = require("../lib/helper");
const { sendTG, sendWX } = require("../lib/net");
const { smsSend, setBaseUrl } = require("./benton");
const mqtt = require("async-mqtt");
// receive mqtt message, parse commmand and send sms

log(process.env.APP_MQTT_SERVER);
log(process.env.APP_MQTT_USER);
log(process.env.APP_MQTT_PASS);

const SMS_SEND_TOPIC = "device/sms/send";
const client = mqtt.connect(process.env.APP_MQTT_SERVER, {
  username: process.env.APP_MQTT_USER,
  password: process.env.APP_MQTT_PASS,
  clientId: "mqtt2sms_20211026",
});

async function handleConnect() {
  try {
    await client.subscribe("device/#");
    log("mqtt subscribed to device/#");
  } catch (err) {
    loge(err);
  }
}

async function handleMessage(topic, message) {
  message = message.toString();
  log("MQTT Received:", topic, message);
  if (topic === SMS_SEND_TOPIC) {
    log("SMS: send command received");
    const parts = message.split(" ");
    if (parts.length >= 2) {
      const phoneNo = parts.shift();
      const text = parts.join(" ");
      if (/^\d+$/.test(phoneNo)) {
        const ret = await smsSend(phoneNo, text);
        log(`SMS: phoneNo:${phoneNo} text:${text} ret:${ret}`);
        await sendWX(
          ret ? "短信发送成功" : "短信发送失败",
          `内容：${text}\n联系人：${phoneNo}`
        );
      } else {
        //invalid phone number
        loge(`SMS: invalid phone number phoneNo:${phoneNo} text:${text}`);
        await sendWX(
          "短信发送失败",
          `[号码格式错误] 内容：${text} 联系人：${phoneNo}`
        );
      }
    } else {
      // invalid content format
      loge(`SMS: invalid command ${topic} ${message}`);
      await sendWX(
        "短信发送失败",
        `[命令格式错误] 内容：${text} 联系人：${phoneNo}`
      );
    }
  } else {
    // ignore topic
    log(`SMS: ignore message ${topic} ${message}`);
  }
}

async function main() {
  if (process.platform.includes("win")) {
    // for dev
    setBaseUrl("http://lte.mcxiaoke.com");
  }

  client.on("connect", handleConnect);
  client.on("message", handleMessage);
  log("MQTT SMS monitor started!");
}

main();
