const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema(
  {
    siteId: {
      type: String,
      required: true,
      index: true
    },
    subSiteId: {
      type: String,
      default: null,
      index: true
    },
    siteName: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// Prevent duplicate site+subSite
siteSchema.index({ siteId: 1, subSiteId: 1 }, { unique: true });

module.exports = mongoose.model("Site", siteSchema);
