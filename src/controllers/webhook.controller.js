const ticketService = require("../services/ticket.service");
const { sendWhatsAppReply } = require("../services/whatsapp.service");
const { extractSiteContext, cleanMessageText } = require("../utils/site.parser");
const hashPhone = require("../utils/hash.util");

/**
 * 🔹 Meta Webhook Verification (GET)
 */
exports.verifyWebhook = (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
};

/**
 * 🔹 WhatsApp Message Receiver (POST)
 */
exports.receiveMessage = async (req, res) => {
  try {
    const message =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    // Meta safety rule
    if (!message) return res.sendStatus(200);

    const from = message.from;
    const type = message.type;
    const waMessageId = message.id;

    /**
     * 🔁 HARD DUPLICATE GUARD (WhatsApp retry protection)
     */
    if (await ticketService.isDuplicateMessage(waMessageId)) {
      console.log("🔁 Duplicate message ignored:", waMessageId);
      return res.sendStatus(200);
    }

    /**
     * 📦 Normalize Message Payload
     */
    let payload = {
      type,
      text: null,
      mediaId: null,
      mimeType: null
    };

    if (type === "text") {
      payload.text = message.text.body;
    }

    if (type === "image") {
      payload.mediaId = message.image.id;
      payload.mimeType = message.image.mime_type;
      payload.text = message.image.caption || null;
    }

    if (type === "audio") {
      payload.mediaId = message.audio.id;
      payload.mimeType = message.audio.mime_type;
    }

    if (type === "video") {
      payload.mediaId = message.video.id;
      payload.mimeType = message.video.mime_type;
      payload.text = message.video.caption || null;
    }

    if (type === "document") {
      payload.mediaId = message.document.id;
      payload.mimeType = message.document.mime_type;
      payload.text = message.document.filename || null;
    }

    /**
     * =========================
     * ✅ STATUS COMMAND HANDLER
     * =========================
     */
    if (type === "text" && payload.text) {
      const text = payload.text.trim();
      const match = text.match(/^status\s+(TKT-\d+-\d+)$/i);

      if (match) {
        const ticketId = match[1].toUpperCase();
        const ticket = await ticketService.getTicketById(ticketId);

        if (!ticket) {
          await sendWhatsAppReply(
            from,
            "❌ Ticket not found. Please check your Ticket ID."
          );
          return res.sendStatus(200);
        }

        await sendWhatsAppReply(
          from,
          `🎫 Ticket ID: ${ticket.ticketId}\nStatus: ${ticket.status}\nLast Updated: ${new Date(
            ticket.updatedAt
          ).toDateString()}`
        );

        return res.sendStatus(200);
      }
    }

    /**
     * =========================
     * 🧩 STEP-3: SITE EXTRACTION (QR ONLY)
     * =========================
     */
    const rawText = payload.text || "";
    const { siteId, subSiteId } = extractSiteContext(rawText);

    if (!siteId) {
      await sendWhatsAppReply(
        from,
        "⚠️ Site information missing.\nPlease scan the site QR code again."
      );
      return res.sendStatus(200);
    }

    payload.text = cleanMessageText(rawText);

    /**
     * =========================
     * 🚨 NEW: ISSUE TEXT VALIDATION
     * =========================
     */
    if (!payload.text || payload.text.length < 3) {
      await sendWhatsAppReply(
        from,
        "⚠️ Please describe the issue briefly after scanning the QR code."
      );
      return res.sendStatus(200);
    }

    /**
     * =========================
     * 🧠 SOFT-DUPLICATE CHECK (OPTION-C)
     * =========================
     */
    const phoneHash = hashPhone(from);
    let duplicateTicket = null;

    duplicateTicket = await ticketService.findRecentSimilarTicket({
      phoneHash,
      siteId,
      subSiteId,
      messageText: payload.text,
      minutes: 30
    });

    /**
     * =========================
     * 🎫 CREATE NEW TICKET
     * =========================
     */
    const ticket = await ticketService.createTicket({
      phone: from,
      waMessageId,
      siteId,
      subSiteId,
      message: payload,
      possibleDuplicateOf: duplicateTicket?.ticketId || null,
      duplicateScore: duplicateTicket ? 0.8 : null
    });

    /**
     * =========================
     * 📤 USER-FRIENDLY WHATSAPP REPLY
     * =========================
     */
    if (duplicateTicket) {
      await sendWhatsAppReply(
        from,
        `⚠️ Note:\nA similar issue was reported recently (Ticket ${duplicateTicket.ticketId}).\n\nWe have still created a new ticket:\n🎫 ${ticket.ticketId}`
      );
    } else {
      await sendWhatsAppReply(
        from,
        `✅ Ticket Created\n🎫 ID: ${ticket.ticketId}\n📍 Site: ${siteId}${subSiteId ? " / " + subSiteId : ""}`
      );
    }

    return res.sendStatus(200);

  } catch (error) {
    console.error("❌ Webhook error:", error);
    return res.sendStatus(500);
  }
};
