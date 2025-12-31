const Ticket = require("../models/ticket.model");
const generateTicketId = require("../utils/ticketId.generator");
const hashPhone = require("../utils/hash.util");

/**
 * 🎫 Create New Ticket (STEP-2 + STEP-3)
 * - Safe for WhatsApp retries
 * - Enforces site mapping
 * - DB-level uniqueness
 */
async function createTicket({
  phone,
  waMessageId,
  siteId,
  subSiteId = null,
  message,
  possibleDuplicateOf = null,
  duplicateScore = null
}) {
  if (!siteId) {
    throw new Error("siteId is required to create a ticket");
  }

  const ticketId = generateTicketId();
  const phoneHash = hashPhone(phone);

  return await Ticket.create({
    ticketId,
    waMessageId,   // 🔐 Idempotency key (duplicate guard)
    phoneHash,
    siteId,        // ✅ STEP-3 mandatory
    subSiteId,     // optional
    message,
    status: "OPEN",
    possibleDuplicateOf,
    duplicateScore
  });
}

/**
 * 🔍 Get Ticket by Business Ticket ID
 * Used by STATUS command & admin panel
 */
async function getTicketById(ticketId) {
  return await Ticket.findOne({ ticketId }).lean();
}

/**
 * 🔁 WhatsApp Duplicate Message Guard
 * Prevents duplicate tickets on retries
 */
async function isDuplicateMessage(waMessageId) {
  if (!waMessageId) return false;
  const exists = await Ticket.exists({ waMessageId });
  return Boolean(exists);
}

async function findRecentSimilarTicket({
  phoneHash,
  siteId,
  subSiteId,
  messageText,
  minutes = 30
}) {
  if (!messageText) return null;

  const since = new Date(Date.now() - minutes * 60 * 1000);

  return Ticket.findOne({
    phoneHash,
    siteId,
    subSiteId: subSiteId || null,
    status: "OPEN",
    createdAt: { $gte: since },
    "message.text": {
      $regex: messageText.slice(0, 40), // simple similarity
      $options: "i"
    }
  })
    .sort({ createdAt: -1 })
    .lean();
}


module.exports = {
  createTicket,
  getTicketById,
  isDuplicateMessage,
  findRecentSimilarTicket
};

