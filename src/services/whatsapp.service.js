const axios = require("axios");

async function sendWhatsAppReply(to, text) {
  const url = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

  await axios.post(
    url,
    {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
}

module.exports = { sendWhatsAppReply };

// console.log(sendWhatsAppReply("919999999999", "Hello"));


///test mode file
// const axios = require("axios");

// const isTest = process.env.NODE_ENV !== "production";

// async function sendWhatsAppReply(to, message) {
//   if (isTest) {
//     console.log("📩 [MOCK WHATSAPP]");
//     console.log("To:", to);
//     console.log("Message:", message);
//     return;
//   }

//   // REAL API CALL (production only)
//   await axios.post(
//     `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`,
//     {
//       messaging_product: "whatsapp",
//       to,
//       type: "text",
//       text: { body: message }
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
//         "Content-Type": "application/json"
//       }
//     }
//   );
// }

// module.exports = { sendWhatsAppReply };
