const Ticket = require("../models/ticket.model");
const generateTicketId = require("../utils/ticketId.generator");

// Escape regex special characters
const escapeRegex = (text = "") =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Normalize phone number
const normalizePhone = (phone) => {
  if (!phone && phone !== 0) return null;
  return String(phone).trim();
};

// Input validation for ticket creation to fail fast in production
const validateTicketPayload = ({ phone, waMessageId, siteId, message }) => {
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone) throw new Error("phone is required to create a ticket");
  if (!waMessageId) throw new Error("waMessageId is required to create a ticket");
  if (!siteId) throw new Error("siteId is required to create a ticket");
  if (!message || !message.type)
    throw new Error("message payload with 'type' is required to create a ticket");

  return normalizedPhone;
};

// Validate AI analysis payload so we don't persist malformed structures
const validateAIAnalysis = (aiAnalysis) => {
  if (!aiAnalysis) return null;

  const sanitized = { ...aiAnalysis };

  if (
    sanitized.confidence !== undefined &&
    typeof sanitized.confidence !== "number"
  ) {
    throw new Error("aiAnalysis.confidence must be a number when provided");
  }

  if (
    sanitized.riskLevel !== undefined &&
    typeof sanitized.riskLevel !== "string"
  ) {
    throw new Error("aiAnalysis.riskLevel must be a string when provided");
  }

  return sanitized;
};
/// ticket service functions

async function createTicket({
  phone,
  waMessageId,
  siteId,
  subSiteId = null,
  message,
  possibleDuplicateOf = null,
  duplicateScore = null
}) {
  const normalizedPhone = validateTicketPayload({
    phone,
    waMessageId,
    siteId,
    message
  });

  const ticketId = generateTicketId();

  try {
    return await Ticket.create({
      ticketId,
      waMessageId,
      phone: normalizedPhone,
      siteId,
      subSiteId,
      message,
      status: "OPEN",
      possibleDuplicateOf,
      duplicateScore
    });
  } catch (err) {
    console.error("Ticket.create failed", err);
    throw err;
  }
}

// Get Ticket by Ticket ID
async function getTicketById(ticketId) {
  return Ticket.findOne({ ticketId }).lean();
}

// Check if a WhatsApp message ID has already been used
async function isDuplicateMessage(waMessageId) {
  if (!waMessageId) return false;
  const exists = await Ticket.exists({ waMessageId });
  return Boolean(exists);
}

// Find recent similar ticket for soft duplicate detection
async function findRecentSimilarTicket({
  phone,
  siteId,
  subSiteId,
  messageText,
  minutes
}) {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) return null;

  const safeMessageText = (messageText || "").slice(0, 500);
  if (!safeMessageText) return null; // nothing to compare against

  const since = new Date(Date.now() - minutes * 60 * 1000);

  const found = await Ticket.findOne({
    phone: normalizedPhone,
    siteId,
    subSiteId,
    status: "OPEN",
    createdAt: { $gte: since },
    "message.text": { $regex: new RegExp(escapeRegex(safeMessageText), "i") }
  }).lean();

  if (!found) return null;

  return {
    ticketId: found.possibleDuplicateOf || found.ticketId
  };
}



async function attachAIAnalysis(ticketId, aiAnalysis) {
  if (!ticketId || !aiAnalysis) return;

  const sanitized = validateAIAnalysis(aiAnalysis);

  try {
    await Ticket.updateOne(
      { _id: ticketId },
      {
        $set: {
          aiAnalysis: {
            lifeSavingRuleViolated: sanitized.lifeSavingRuleViolated,
            ruleName: sanitized.ruleName,
            riskLevel: sanitized.riskLevel,
            observationSummary: sanitized.observationSummary,
            whyThisIsDangerous: sanitized.whyThisIsDangerous,
            mentorPrecautions: sanitized.mentorPrecautions || [],
            confidence: sanitized.confidence,
            textImageAligned: sanitized.textImageAligned,
            alignmentReason: sanitized.alignmentReason,
            contentType: sanitized.contentType
          }
        }
      }
    );
  } catch (err) {
    console.error("Ticket.updateOne (attachAIAnalysis) failed", err);
    throw err;
  }
}


module.exports = {
  createTicket,
  getTicketById,
  isDuplicateMessage,
  findRecentSimilarTicket,
  attachAIAnalysis
};
