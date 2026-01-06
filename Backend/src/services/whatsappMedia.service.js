const axios = require("axios");

/**
 * 📸 Fetch WhatsApp Media (Image / Video / Document)
 * -----------------------------------------------
 * Returns:
 * {
 *   base64: string,
 *   mimeType: string,
 *   size: number | null
 * }
 *
 * ❗ NEVER throws fatal error
 */
async function fetchWhatsAppMedia(mediaId) {
  if (!mediaId) return null;

  const token = process.env.WHATSAPP_TOKEN;
  if (!token) return null;

  try {
    // 1️⃣ Fetch metadata
    const metaRes = await axios.get(
      `https://graph.facebook.com/v19.0/${mediaId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      }
    );

    if (!metaRes.data?.url) return null;

    // 2️⃣ Download binary
    const binaryRes = await axios.get(metaRes.data.url, {
      responseType: "arraybuffer",
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
      maxContentLength: 10 * 1024 * 1024
    });

    // 3️⃣ Convert to base64
    return {
      base64: Buffer.from(binaryRes.data).toString("base64"),
      mimeType: metaRes.data.mime_type || "application/octet-stream",
      size: binaryRes.data.length || null
    };

  } catch (err) {
    console.error("❌ WhatsApp media fetch failed:", err.message);
    return null;
  }
}

module.exports = { fetchWhatsAppMedia };
