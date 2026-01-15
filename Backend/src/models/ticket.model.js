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

    phone: {
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
       RESOLUTION DETAILS
    ============================ */
    resolutionDetails: {
      photoUrl: String,           // Cloudinary URL
      notes: String,              // Optional resolution notes
      resolvedBy: String,         // Admin username who resolved
      resolvedAt: Date            // Timestamp when resolved
    },

    /* ============================
       TICKET STATUS
    ============================ */
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      default: "OPEN",
      index: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

/* =====================================================
    PRODUCTION INDEXES (CRITICAL)
===================================================== */

/**
 *  Main dashboard queries
 * OWNER / SITE_ADMIN / SUB_SITE_ADMIN
 */
ticketSchema.index(
  { siteId: 1, subSiteId: 1, status: 1, createdAt: -1 },
  { name: "idx_site_subsite_status_createdAt" }
);

/**
 *  Site-level views (SITE_ADMIN)
 */
ticketSchema.index(
  { siteId: 1, status: 1, createdAt: -1 },
  { name: "idx_site_status_createdAt" }
);

/**
 *  Sub-site views (SUB_SITE_ADMIN)
 */
ticketSchema.index(
  { siteId: 1, subSiteId: 1, createdAt: -1 },
  { name: "idx_site_subsite_createdAt" }
);

/**
 *  Fast ticket lookup
 */
ticketSchema.index(
  { ticketId: 1 },
  { unique: true, name: "idx_ticketId_unique" }
);

/**
 *  Duplicate detection support
 */
ticketSchema.index(
  { phone: 1, siteId: 1, createdAt: -1 },
  { name: "idx_duplicate_detection_phone" }
);

module.exports = mongoose.model("Ticket", ticketSchema);