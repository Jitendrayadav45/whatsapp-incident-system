const Site = require("../models/site.model");
const SubSite = require("../models/subSite.model");

/**
 * ✅ CREATE SITE (OWNER ONLY)
 * POST /api/admin/sites
 */
exports.createSite = async (req, res) => {
  try {
    const admin = req.admin;
    const { siteId, siteName, description } = req.body;

    if (admin.role !== "OWNER") {
      return res.status(403).json({ error: "Only OWNER can create sites" });
    }

    if (!siteId || !siteName) {
      return res.status(400).json({ error: "siteId and siteName are required" });
    }

    const exists = await Site.exists({ siteId: siteId.toUpperCase() });
    if (exists) {
      return res.status(409).json({ error: "Site already exists" });
    }

    const site = await Site.create({
      siteId: siteId.toUpperCase(),
      siteName,
      description: description || null,
      createdBy: admin._id
    });

    return res.status(201).json({
      message: "Site created successfully",
      site
    });

  } catch (err) {
    console.error("Create Site error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * 📋 GET SITES (ROLE AWARE)
 * GET /api/admin/sites
 */
exports.getSites = async (req, res) => {
  try {
    const admin = req.admin;
    const filter = {};

    if (admin.role !== "OWNER") {
      filter.siteId = { $in: admin.allowedSites || [] };
    }

    const sites = await Site.find(filter).lean();
    const siteIds = sites.map(s => s.siteId);

    const subSites = await SubSite.find({
      siteId: { $in: siteIds },
      isActive: true
    }).lean();

    const response = sites.map(site => ({
      siteId: site.siteId,
      siteName: site.siteName,
      isActive: site.isActive,
      subSites: subSites
        .filter(sub => sub.siteId === site.siteId)
        .map(sub => ({
          subSiteId: sub.subSiteId,
          subSiteName: sub.subSiteName
        }))
    }));

    return res.json(response);

  } catch (err) {
    console.error("Get Sites error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};