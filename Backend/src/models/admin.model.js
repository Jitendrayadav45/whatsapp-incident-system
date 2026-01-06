const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    passwordHash: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["OWNER", "SITE_ADMIN", "SUB_SITE_ADMIN"],
      required: true,
      index: true
    },

    allowedSites: {
      type: [String],
      default: [],
      index: true
    },

    allowedSubSites: {
      type: [String],
      default: [],
      index: true
    },

    /** 👇 AUDIT OWNER */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null // OWNER ke liye null
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

/* Helpful index */
adminSchema.index({ role: 1, isActive: 1 });

module.exports = mongoose.model("Admin", adminSchema);