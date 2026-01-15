const NodeCache = require("node-cache");

const siteSessionCache = new NodeCache({
  stdTTL: 600, // 10 minutes
  checkperiod: 120
});

module.exports = siteSessionCache;
