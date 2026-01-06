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


function cleanMessageText(text) {
  if (!text) return "";

  return text
    .replace(/SITE:[^| ]+/gi, "")
    .replace(/SUB:[^| ]+/gi, "")
    .replace(/^\s*\|\s*/, "")
    .trim();
}
exports.cleanMessageText = cleanMessageText;