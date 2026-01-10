const ticketService = require("../services/ticket.service");
const { sendWhatsAppReply } = require("../services/whatsapp.service");
const { extractSiteContext, cleanMessageText } = require("../utils/site.parser");
const hashPhone = require("../utils/hash.util");
const MESSAGES = require("../messages/whatsappMessages");
const { analyzeSafety } = require("../services/safetyAI.service");
const { fetchWhatsAppMedia } = require("../services/whatsappMedia.service");
const { validateSiteContext } = require("../services/siteValidation.service");
const { uploadImageBase64 } = require("../services/cloudinary.service");

/**
 * 🔹 Webhook Verification
 */
exports.verifyWebhook = (req, res) => {
  if (
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] === process.env.VERIFY_TOKEN
  ) {
    return res.status(200).send(req.query["hub.challenge"]);
  }
  return res.sendStatus(403);
};

/**
 * 🔹 WhatsApp Receiver (PRODUCTION)
 */
exports.receiveMessage = async (req, res) => {
  let sender = null;

  try {
    const message =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const { from, type, id: waMessageId } = message;
    sender = from;

    /* 🔁 HARD DUPLICATE GUARD */
    if (await ticketService.isDuplicateMessage(waMessageId)) {
      return res.sendStatus(200);
    }

    /* 📦 Normalize payload */
    const payload = { type, text: null, mediaId: null, mimeType: null };

    if (type === "text") payload.text = message.text.body;

    if (type === "image") {
      payload.mediaId = message.image.id;
      payload.mimeType = message.image.mime_type;
      payload.text = message.image.caption || null;
    }

    if (type === "audio") payload.mediaId = message.audio.id;

    if (type === "video") {
      payload.mediaId = message.video.id;
      payload.text = message.video.caption || null;
    }

    if (type === "document") {
      payload.mediaId = message.document.id;
      payload.text = message.document.filename || null;
    }

    /* 🔎 STATUS COMMAND */
    if (type === "text" && payload.text) {
      const match = payload.text.trim().match(/^status\s+(TKT-\d+-\d+)$/i);
      if (match) {
        const ticket = await ticketService.getTicketById(match[1]);
        await sendWhatsAppReply(
          sender,
          ticket
            ? MESSAGES.STATUS_REPLY_MESSAGE(ticket)
            : MESSAGES.STATUS_NOT_FOUND_MESSAGE
        );
        return res.sendStatus(200);
      }
    }

    /* 👋 MVP WELCOME FLOW (SAFE) */
    if (type === "text" && payload.text) {
      const text = payload.text.trim().toLowerCase();

      const isWelcomeCandidate =
        text.length <= 10 &&
        !text.includes("site") &&
        !text.includes("leak") &&
        !text.includes("broken") &&
        !text.includes("fire") &&
        !text.includes("unsafe") &&
        !text.includes("accident") &&
        !text.includes("injury");

      if (isWelcomeCandidate) {
        await sendWhatsAppReply(sender, MESSAGES.WELCOME_MESSAGE);
        return res.sendStatus(200);
      }
    }

    /* 🧩 SITE EXTRACTION */
    const rawText = payload.text || "";
    const { siteId, subSiteId } = extractSiteContext(rawText);

    /* 🔐 AUTHORITATIVE SITE VALIDATION (NEW – CRITICAL) */
    const siteCheck = await validateSiteContext({ siteId, subSiteId });

    if (!siteCheck.valid) {
      await sendWhatsAppReply(sender, MESSAGES.INVALID_SITE_MESSAGE);
      return res.sendStatus(200);
    }

    /* ✂️ Clean issue text AFTER site validation */
    payload.text = cleanMessageText(rawText);

    // Allow image-only reports (with SITE/SUB) by injecting a placeholder text
    if (!payload.text || payload.text.length < 3) {
      if (type === "image" && payload.mediaId) {
        payload.text = "(no text provided; image-only report)";
      } else {
        await sendWhatsAppReply(sender, MESSAGES.ISSUE_TOO_SHORT_MESSAGE);
        return res.sendStatus(200);
      }
    }

    // Fetch media early (needed for Cloudinary + AI) if image
    let imageBase64 = null;
    let imageMimeType = payload.mimeType || null;

    if (type === "image" && payload.mediaId) {
      const media = await fetchWhatsAppMedia(payload.mediaId);
      if (media?.base64) imageBase64 = media.base64;
      if (media?.mimeType) imageMimeType = media.mimeType;

      try {
        const uploaded = await uploadImageBase64({
          base64: media?.base64,
          mimeType: media?.mimeType
        });
        if (uploaded?.url) {
          payload.mediaUrl = uploaded.url;
        }
      } catch (upErr) {
        console.error("Cloudinary upload failed:", upErr.message);
      }
    }

    /* 🔁 SOFT DUPLICATE DETECTION */
    const duplicateTicket = await ticketService.findRecentSimilarTicket({
      phoneHash: hashPhone(sender),
      siteId,
      subSiteId,
      messageText: payload.text,
      minutes: 30
    });

    /* 🎫 CREATE TICKET (SYSTEM OF RECORD) */
    const ticket = await ticketService.createTicket({
      phone: sender,
      waMessageId,
      siteId,
      subSiteId,
      message: payload,
      possibleDuplicateOf: duplicateTicket?.ticketId || null,
      duplicateScore: duplicateTicket ? 0.8 : null
    });

    /* 📤 USER CONFIRMATION */
    if (duplicateTicket) {
      await sendWhatsAppReply(
        sender,
        MESSAGES.DUPLICATE_WARNING_MESSAGE({
          oldTicketId: duplicateTicket.ticketId,
          newTicketId: ticket.ticketId
        })
      );
    } else {
      await sendWhatsAppReply(
        sender,
        MESSAGES.TICKET_SUCCESS_BASE({
          ticketId: ticket.ticketId,
          siteId,
          subSiteId,
          issue: payload.text
        }) + MESSAGES.FOOTER_MESSAGE
      );
    }

    /* 🤖 AI SAFETY ANALYSIS (DB FIRST, MESSAGE LATER) */
    try {
      const aiResult = await analyzeSafety({
        imageBase64,
        imageMimeType,
        text: payload.text,
        siteType: "industrial site"
      });

      if (aiResult) {
        await ticketService.attachAIAnalysis(ticket._id, {
          lifeSavingRuleViolated: aiResult.life_saving_rule_violated,
          ruleName: aiResult.rule_name,
          riskLevel: aiResult.risk_level,
          observationSummary: aiResult.observation_summary,
          whyThisIsDangerous: aiResult.why_this_is_dangerous,
          mentorPrecautions: aiResult.mentor_precautions || [],
          confidence: aiResult.confidence,
          textImageAligned: aiResult.text_image_aligned,
          alignmentReason: aiResult.alignment_reason,
          contentType: aiResult.content_type
        });

        if (aiResult.life_saving_rule_violated) {
          await sendWhatsAppReply(
            sender,
            MESSAGES.AI_WARNING_MESSAGE({
              ruleName: aiResult.rule_name,
              whyThisIsDangerous: aiResult.why_this_is_dangerous,
              mentorPrecautions: aiResult.mentor_precautions
            }) + MESSAGES.FOOTER_MESSAGE
          );
        }
      }
    } catch (aiErr) {
      console.error("AI analysis skipped:", aiErr.message);
    }

    /* 📎 MEDIA ACK (UX ONLY) */
    if (type === "image")
      await sendWhatsAppReply(sender, MESSAGES.IMAGE_CONFIRMATION_MESSAGE);
    if (type === "audio")
      await sendWhatsAppReply(sender, MESSAGES.AUDIO_CONFIRMATION_MESSAGE);
    if (type === "video")
      await sendWhatsAppReply(sender, MESSAGES.VIDEO_CONFIRMATION_MESSAGE);
    if (type === "document")
      await sendWhatsAppReply(sender, MESSAGES.DOCUMENT_CONFIRMATION_MESSAGE);

    return res.sendStatus(200);

  } catch (err) {
    console.error("❌ Webhook error:", err);
    if (sender) {
      await sendWhatsAppReply(sender, MESSAGES.SYSTEM_ERROR_MESSAGE);
    }
    return res.sendStatus(500);
  }
};