const nodemailer = require("nodemailer");
const { log, loge } = require("./helper");
const config = require("dotenv").config();
const DEBUG = process.env.DEBUG;

const smtpOptions = {
  host: process.env.APP_SMTP_HOST,
  port: 465,
  // true for 465, false for other ports
  secure: true,
  auth: {
    user: process.env.APP_SMTP_USERNAME,
    pass: process.env.APP_SMTP_PASSWORD,
  },
};

async function sendMail(mail = {}, options = smtpOptions) {
  let transporter = nodemailer.createTransport(options);
  const mailOptions = Object.assign(
    {
      from: `"Little Cat" <${process.env.APP_SMTP_USERNAME}>`,
      bcc: process.env.APP_SMTP_BCC,
    },
    mail
  );
  //   console.log("smtpSend req:", mailOptions);
  let response = await transporter.sendMail(mailOptions);

  //   console.log("smtpSend res:", response);

  return response;
}

async function sendSMSMail(phoneNo, text) {
  log("sendSMSMail req:", phoneNo, text.substring(0, 24));
  const mailOptions = {
    from: `"SMS Cat" <${process.env.APP_SMTP_USERNAME}>`,
    to: process.env.APP_SMTP_SMS_TO,
    subject: `来自 ${phoneNo} 的新短信`,
    text: `${text} (${phoneNo})`,
    html: `<p>****************************************</p>
    <p><b>短信内容：</b></p>
    <p>${text}</p>
    <p></p>
    <p><b>短信来自：${phoneNo}</b></p>
    <p>****************************************</p>`,
  };
  try {
    const res = await sendMail(mailOptions);
    log("sendSMSMail res:", res.messageId);
  } catch (error) {
    loge("sendSMSMail err:", String(error));
  }
}

async function test() {
  // https://nodemailer.com/smtp/
  // https://nodemailer.com/smtp/envelope/
  // send mail with defined transport object
  //  let info = await transporter.sendMail({
  //     from: '"Fred Foo 👻" <foo@example.com>', // sender address
  //     to: "bar@example.com, baz@example.com", // list of receivers
  //     subject: "Hello ✔", // Subject line
  //     text: "Hello world?", // plain text body
  //     html: "<b>Hello world?</b>", // html body
  //   });
  const mail = {
    to: "xxxxxx@live.com",
    cc: "xxxxxx@gmail.com, xxxxxx@qq.com",
    bcc: "xxxxxx@icloud.com",
    subject: "收到来自 +18812345678 的新短信",
    text: `收到来自 +18812345678 的新短信
    短信内容：【哈哈】你好，哈哈物流，你地球超市的包裹放在你们小区的XX超市了，请有时间去取一下，快递员电话12345678900 (2021-08-15 19:04:21)
    短信时间：2021-07-24 19:04:23
    短信来自：+18812345678`,
    html: `<p>****************************************</p>
    <p><b>短信内容：</b></p>
    <p>【哈哈】你好，哈哈物流，你地球超市的包裹放在你们小区的XX超市了，请有时间去取一下，快递员电话12345678900 (2021-08-24 19:04:15)</p>
    <p></p>
    <p><b>短信时间：2021-07-24 19:04:23</b></p>
    <p><b>短信来自：+18512345678</b></p>
    <p>****************************************</p>`,
  };
  await sendMail(mail);
}

// test();
module.exports = {
  sendSMSMail,
  sendMail,
};
