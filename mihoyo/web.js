const util = require("util");
const dayjs = require("dayjs");
const { log, loge, sleep } = require("../lib/helper");
const api = require("./api");
const cache = require("./cache");
const config = require("dotenv").config();
const DEBUG = process.env.DEBUG;

const uid = process.env.MIHOYO_UID;
const cookie = process.env.MIHOYO_COOKIE;

const express = require("express");
require("express-async-errors");

const port = 8001;
const expireSecs = 600; // in seconds
const kDailyNote = "mihoyo::api::dailyNote";
const app = express();

app.get("/", async (req, res) => {
  res.send({ code: 0, message: "Hello MiHoYo!" });
});

app.get("/dailyNote", async (req, res) => {
  let data = cache.get(kDailyNote);
  if (!data) {
    data = (await api.getDailyNote(uid, cookie)) || {};
    if (!data || !data["data"] || data["retcode"] !== 0) {
      loge("web:error:data, ", data);
      res.status(403);
      res.send(data);
      return;
    }
    cache.set(kDailyNote, data, expireSecs);
    log("web:api:data:", data["retcode"]);
  } else {
    log("web:cache:data:", data["retcode"]);
  }
  res.send(data);
});

app.listen(port, () => log(`MiHoYo API Proxy on port ${port}`));
