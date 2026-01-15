const mongoose = require("mongoose");

const ticketReportSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      index: true
    },
    siteId: {
      type: String,
      required: true,
      uppercase: true,
      index: true
    },
    subSiteId: {
      type: String,
      default: null,
      uppercase: true,
      index: true
    },
    reporterAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true
    },
    reporterRole: {
      type: String,
      enum: ["OWNER", "SITE_ADMIN", "SUB_SITE_ADMIN"],
      required: true,
      index: true
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "dismissed"],
      default: "pending",
      index: true
    },
    ownerNote: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

ticketReportSchema.index({ ticketId: 1, reporterAdminId: 1 });

ticketReportSchema.index({ siteId: 1, subSiteId: 1, createdAt: -1 });

module.exports = mongoose.model("TicketReport", ticketReportSchema);
