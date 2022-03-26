const NodeCache = require("node-cache");
// https://www.npmjs.com/package/node-cache
// https://www.npmjs.com/package/cacache
// https://www.npmjs.com/package/keyv
const cache = new NodeCache();

function set(key, value, ttl) {
  cache.set(key, value, ttl);
}

function get(key) {
  return cache.get(key);
}

module.exports = { set, get };
