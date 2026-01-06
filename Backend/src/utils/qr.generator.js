const QRCode = require("qrcode");

async function generateSiteQR({ whatsappNumber, siteId, subSiteId }) {
  let text = `SITE:${siteId}`;
  if (subSiteId) text += `|SUB:${subSiteId}`;

  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

  const qrDataUrl = await QRCode.toDataURL(waLink);

  return {
    waLink,
    qrDataUrl
  };
}

module.exports = { generateSiteQR };
