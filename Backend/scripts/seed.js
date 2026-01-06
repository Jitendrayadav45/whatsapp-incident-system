/**
 * =====================================================
 * 🌱 SYSTEM SEED SCRIPT (PRODUCTION SAFE)
 * =====================================================
 * Purpose:
 * - Create OWNER (once)
 * - Create Sites & SubSites
 * - Create SITE_ADMIN & SUB_SITE_ADMIN
 *
 * Safe to run multiple times (idempotent)
 *
 * Run manually only:
 *    npm run seed
 * =====================================================
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/* ============================
   MODELS
============================ */
const Admin = require("../src/models/admin.model");
const Site = require("../src/models/site.model");
const SubSite = require("../src/models/subSite.model");

/* ============================
   CONFIG (CHANGE CAREFULLY)
============================ */
const OWNER_EMAIL = "xyz@gmail.com";
const OWNER_PASSWORD = "Jitendra@123"; // first login only
const OWNER_NAME = "System Owner";

/* Initial structure */
const SITES = [
  {
    siteId: "GITA",
    siteName: "GITA Main Plant",
    subSites: [
      { subSiteId: "GITA1", subSiteName: "GITA Unit 1" },
      { subSiteId: "GITA2", subSiteName: "GITA Unit 2" }
    ]
  }
];

/* ============================
   HELPER: CREATE ADMIN SAFELY
============================ */
async function createAdminIfNotExists({
  name,
  email,
  password,
  role,
  allowedSites = [],
  allowedSubSites = []
}) {
  const exists = await Admin.findOne({ email }).lean();
  if (exists) {
    console.log(`⚠ ${role} already exists: ${email}`);
    return exists;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await Admin.create({
    name,
    email,
    passwordHash,
    role,
    allowedSites,
    allowedSubSites,
    isActive: true
  });

  console.log(`✅ ${role} created: ${email}`);
  return admin;
}

/* ============================
   ENTRY POINT
============================ */
async function seed() {
  try {
    console.log("🌱 Starting system seed...");

    /* 1️⃣ CONNECT DB */
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    /* 2️⃣ GET OR CREATE OWNER */
    let owner = await Admin.findOne({ role: "OWNER" });

    if (!owner) {
      const passwordHash = await bcrypt.hash(OWNER_PASSWORD, 10);

      owner = await Admin.create({
        name: OWNER_NAME,
        email: OWNER_EMAIL,
        passwordHash,
        role: "OWNER",
        allowedSites: [],
        isActive: true
      });

      console.log("✅ OWNER created:", owner.email);
    } else {
      console.log("ℹ OWNER already exists:", owner.email);
    }

    /* 3️⃣ CREATE SITES & SUBSITES */
    for (const siteData of SITES) {
      const { siteId, siteName, subSites } = siteData;

      let site = await Site.findOne({ siteId });

      if (!site) {
        site = await Site.create({
          siteId,
          siteName,
          createdBy: owner._id
        });
        console.log(`✅ Site created: ${siteId}`);
      } else {
        console.log(`⚠ Site ${siteId} already exists`);
      }

      for (const sub of subSites || []) {
        const exists = await SubSite.exists({
          siteId,
          subSiteId: sub.subSiteId
        });

        if (exists) {
          console.log(`⚠ SubSite ${sub.subSiteId} already exists`);
          continue;
        }

        await SubSite.create({
          siteId,
          subSiteId: sub.subSiteId,
          subSiteName: sub.subSiteName,
          createdBy: owner._id
        });

        console.log(`   ↳ SubSite created: ${sub.subSiteId}`);
      }
    }

    /* 4️⃣ CREATE SITE ADMIN */
    await createAdminIfNotExists({
      name: "GITA Site Admin",
      email: "gita.admin@company.com",
      password: "ChangeMe@123",
      role: "SITE_ADMIN",
      allowedSites: ["GITA"]
    });

    /* 5️⃣ CREATE SUB-SITE ADMINS */
    await createAdminIfNotExists({
      name: "GITA Unit 1 Admin",
      email: "gita1.admin@company.com",
      password: "ChangeMe@123",
      role: "SUB_SITE_ADMIN",
      allowedSites: ["GITA"],
      allowedSubSites: ["GITA1"]
    });

    await createAdminIfNotExists({
      name: "GITA Unit 2 Admin",
      email: "gita2.admin@company.com",
      password: "ChangeMe@123",
      role: "SUB_SITE_ADMIN",
      allowedSites: ["GITA"],
      allowedSubSites: ["GITA2"]
    });

    console.log("🎉 SEED COMPLETED SUCCESSFULLY");
    process.exit(0);

  } catch (err) {
    console.error("❌ SEED FAILED:", err);
    process.exit(1);
  }
}

/* ============================
   RUN
============================ */
seed();