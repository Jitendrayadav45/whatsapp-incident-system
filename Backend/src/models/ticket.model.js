const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    /* ============================
       IDENTIFIERS
    ============================ */
    ticketId: {
      type: String,
      required: true,
      unique: true, // business-level ID
      index: true,
    },

    waMessageId: {
      type: String,
      required: true,
      unique: true, // WhatsApp idempotency
      index: true,
    },

    phoneHash: {
      type: String,
      required: true,
      index: true, // duplicate detection
    },

    /* ============================
       MESSAGE PAYLOAD
    ============================ */
    message: {
      type: {
        type: String,
        enum: ["text", "image", "audio", "video", "document"],
        required: true,
      },
      text: String,
      mediaId: String,
      mimeType: String,
      mediaUrl: String,
    },

    /* ============================
       SITE CONTEXT
    ============================ */
    siteId: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },

    subSiteId: {
      type: String,
      default: null,
      uppercase: true,
      index: true,
    },

    /* ============================
       DUPLICATE HANDLING
    ============================ */
    possibleDuplicateOf: {
      type: String, // earlier ticketId
      default: null,
      index: true,
    },

    duplicateScore: {
      type: Number, // similarity score (0–1)
      default: null,
    },

    /* ============================
       AI SAFETY ANALYSIS
    ============================ */
    aiAnalysis: {
      lifeSavingRuleViolated: Boolean,
      ruleName: String,
      riskLevel: String,
      observationSummary: String,
      whyThisIsDangerous: String,
      mentorPrecautions: [String],
      confidence: Number,
      textImageAligned: Boolean,
      alignmentReason: String,
      contentType: String, // text-only | image-only | image+text
      analyzedAt: {
        type: Date,
        default: Date.now,
      },
    },

    /* ============================
       TICKET STATUS
    ============================ */
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED"],
      default: "OPEN",
      index: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

/* =====================================================
   📌 PRODUCTION INDEXES (CRITICAL)
===================================================== */

/**
 * 1️⃣ Main dashboard queries
 * OWNER / SITE_ADMIN / SUB_SITE_ADMIN
 */
ticketSchema.index(
  { siteId: 1, subSiteId: 1, status: 1, createdAt: -1 },
  { name: "idx_site_subsite_status_createdAt" }
);

/**
 * 2️⃣ Site-level views (SITE_ADMIN)
 */
ticketSchema.index(
  { siteId: 1, status: 1, createdAt: -1 },
  { name: "idx_site_status_createdAt" }
);

/**
 * 3️⃣ Sub-site views (SUB_SITE_ADMIN)
 */
ticketSchema.index(
  { siteId: 1, subSiteId: 1, createdAt: -1 },
  { name: "idx_site_subsite_createdAt" }
);

/**
 * 4️⃣ Fast ticket lookup
 */
ticketSchema.index(
  { ticketId: 1 },
  { unique: true, name: "idx_ticketId_unique" }
);

/**
 * 5️⃣ Duplicate detection support
 */
ticketSchema.index(
  { phoneHash: 1, siteId: 1, createdAt: -1 },
  { name: "idx_duplicate_detection" }
);

module.exports = mongoose.model("Ticket", ticketSchema);