const dayjs = require("dayjs");

const gCount = new Map();
let gLimit = new Map();
let gSet = new Set();

function isValueSet(v) {
  const r = gSet.has(v);
  gSet.add(v);
  return r;
}

function isLimitExceeded(key) {
  if (!key || key.length === 0) {
    throw Error("invalid key");
  }
  const dl = gLimit.get(key + "_day") || 0;
  const hl = gLimit.get(key + "_hour") || 0;
  const ml = gLimit.get(key + "_minute") || 0;
  const dk = key + dayjs(Date.now()).format("_YYYYMMDD");
  const hk = key + dayjs(Date.now()).format("_YYYYMMDD:HH");
  const mk = key + dayjs(Date.now()).format("_YYYYMMDD:HHmm");
  const dc = gCount.get(dk) || 0;
  const hc = gCount.get(hk) || 0;
  const mc = gCount.get(mk) || 0;
  if (dl > 0) {
    gCount.set(dk, dc + 1);
  } else {
    gCount.delete(dk);
  }
  if (hl > 0) {
    gCount.set(hk, hc + 1);
  } else {
    gCount.delete(hk);
  }
  if (ml > 0) {
    gCount.set(mk, mc + 1);
  } else {
    gCount.delete(mk);
  }
  return dc > dl || hc > hl || mc > ml;
}

function config(key, minuteLimit, hourLimit, dayLimit) {
  if (!key || key.length === 0) {
    throw Error("invalid key");
  }
  gLimit.set(key + "_minute", minuteLimit || 0);
  gLimit.set(key + "_hour", hourLimit || 0);
  gLimit.set(key + "_day", dayLimit || 0);
}

module.exports = { isLimitExceeded, config, isValueSet };
