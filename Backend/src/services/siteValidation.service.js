const Site = require("../models/site.model");
const SubSite = require("../models/subSite.model");

async function validateSiteContext({ siteId, subSiteId }) {
  if (!siteId) return { valid: false };

  const site = await Site.findOne({
    siteId,
    isActive: true
  }).lean();

  if (!site) return { valid: false };

  if (subSiteId) {
    const sub = await SubSite.findOne({
      siteId,
      subSiteId,
      isActive: true
    }).lean();

    if (!sub) return { valid: false };
  }

  return { valid: true };
}

module.exports = { validateSiteContext };