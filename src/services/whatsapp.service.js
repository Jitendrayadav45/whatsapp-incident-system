const axios = require("axios");

/**
 * Send WhatsApp message
 * - REAL WhatsApp API always
 * - Test mode handled OUTSIDE this file
 */
async function sendWhatsAppReply(to, message) {
  if (!process.env.WHATSAPP_TOKEN || !process.env.PHONE_NUMBER_ID) {
    console.error("❌ WhatsApp credentials missing");
    return;
  }

  const url = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

  try {
    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    console.error("❌ WhatsApp API Error:", err.response?.data || err.message);
  }
}

module.exports = { sendWhatsAppReply };

