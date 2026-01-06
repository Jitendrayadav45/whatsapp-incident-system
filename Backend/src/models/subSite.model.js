const mongoose = require("mongoose");

const subSiteSchema = new mongoose.Schema(
  {
    subSiteId: {
      type: String,
      required: true,
      uppercase: true,
      index: true // GITA1, ZONE-A
    },

    siteId: {
      type: String,
      required: true,
      uppercase: true,
      index: true // Parent site (GITA)
    },

    subSiteName: {
      type: String,
      required: true
    },

    /**
     * 🔐 Governance
     * Can be OWNER or SITE_ADMIN
     */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    },

    /**
     * Optional metadata
     */
    description: {
      type: String,
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

/**
 * 🔒 One SubSite per Site
 */
subSiteSchema.index(
  { siteId: 1, subSiteId: 1 },
  { unique: true }
);

module.exports = mongoose.model("SubSite", subSiteSchema);