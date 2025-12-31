require("dotenv").config();

const connectDB = require("./src/config/db");
const { createTicket } = require("./src/services/ticket.service");

(async () => {
  try {
    await connectDB();

    const ticket = await createTicket({
      from: "919999999999",
      message: {
  type: "image",
  mediaId: "TEST_MEDIA_ID",
  mimeType: "image/jpeg",
  text: "Broken product photo"
}

    });

    console.log("🎫 Ticket Created:", ticket);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
