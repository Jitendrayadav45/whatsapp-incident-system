exports.extractSiteContext = (text = "") => {
  let siteId = null;
  let subSiteId = null;

  // Match SITE:<value>
  const siteMatch = text.match(/SITE:([A-Z0-9_-]+)/i);
  if (siteMatch) {
    siteId = siteMatch[1].toUpperCase();
  }

  // Match SUB:<value>
  const subMatch = text.match(/SUB:([A-Z0-9_-]+)/i);
  if (subMatch) {
    subSiteId = subMatch[1].toUpperCase();
  }

  return { siteId, subSiteId };
};


exports.cleanMessageText = (text = "") => {
  return text
    .replace(/SITE:[A-Z0-9_-]+/gi, "")
    .replace(/SUB:[A-Z0-9_-]+/gi, "")
    .trim();
};

