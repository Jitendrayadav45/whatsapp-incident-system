const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true, // ✅ BUSINESS ID uniqueness
      index: true,
    },

    waMessageId: {
      type: String,
      required: true,
      unique: true, // ✅ WhatsApp idempotency
      index: true,
    },

    phoneHash: {
      type: String,
      required: true,
    },

    message: {
      type: {
        type: String,
        enum: ["text", "image", "audio", "video", "document"],
        required: true,
      },
      text: String,
      mediaId: String,
      mimeType: String,
    },

    siteId: {
      type: String,
      required: true,
      index: true,
    },

    subSiteId: {
      type: String,
      default: null,
      index: true,
    },
    possibleDuplicateOf: {
      type: String, // ticketId of earlier ticket
      default: null,
      index: true,
    },

    duplicateScore: {
      type: Number, // similarity score (0–1)
      default: null,
    },

    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED"],
      default: "OPEN",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);

// console.log(ticketSchema.indexes());
