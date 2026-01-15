const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema(
  {
    siteId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true // GITA, PLANT01
    },

    siteName: {
      type: String,
      required: true
    },

    /**
     *  Governance
     * OWNER who created this site
     */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    },

    /**
     * Optional metadata (future safe)
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

module.exports = mongoose.model("Site", siteSchema);