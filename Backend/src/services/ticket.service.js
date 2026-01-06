const Ticket = require("../models/ticket.model");
const generateTicketId = require("../utils/ticketId.generator");
const hashPhone = require("../utils/hash.util");

/**
 * 🎫 Create New Ticket
 * - WhatsApp retry safe
 * - QR site enforced
 * - System of record
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

  return Ticket.create({
    ticketId,
    waMessageId,
    phoneHash,
    siteId,
    subSiteId,
    message,
    status: "OPEN",
    possibleDuplicateOf,
    duplicateScore
  });
}

/**
 * 🔍 Get Ticket by Ticket ID
 */
async function getTicketById(ticketId) {
  return Ticket.findOne({ ticketId }).lean();
}

/**
 * 🔁 WhatsApp retry guard
 */
async function isDuplicateMessage(waMessageId) {
  if (!waMessageId) return false;
  const exists = await Ticket.exists({ waMessageId });
  return Boolean(exists);
}

/**
 * 🧠 Soft duplicate detection (Option-C)
 */
async function findRecentSimilarTicket({
  phoneHash,
  siteId,
  subSiteId,
  messageText,
  minutes
}) {
  const since = new Date(Date.now() - minutes * 60 * 1000);

  const found = await Ticket.findOne({
    phoneHash,
    siteId,
    subSiteId,
    status: "OPEN",
    createdAt: { $gte: since },
    "message.text": { $regex: messageText, $options: "i" }
  }).lean();

  if (!found) return null;

  return {
    ticketId: found.possibleDuplicateOf || found.ticketId
  };
}

/**
 * 🤖 Attach AI analysis (annotation only)
 */
async function attachAIAnalysis(ticketId, aiAnalysis) {
  if (!ticketId || !aiAnalysis) return;

  await Ticket.updateOne(
    { _id: ticketId },
    {
      $set: {
        aiAnalysis: {
          lifeSavingRuleViolated: aiAnalysis.lifeSavingRuleViolated,
          ruleName: aiAnalysis.ruleName,
          riskLevel: aiAnalysis.riskLevel,
          observationSummary: aiAnalysis.observationSummary,
          whyThisIsDangerous: aiAnalysis.whyThisIsDangerous,
          mentorPrecautions: aiAnalysis.mentorPrecautions || [],
          confidence: aiAnalysis.confidence
        }
      }
    }
  );
}


module.exports = {
  createTicket,
  getTicketById,
  isDuplicateMessage,
  findRecentSimilarTicket,
  attachAIAnalysis
};
