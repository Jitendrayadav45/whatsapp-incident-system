const Site = require("../models/site.model");
const SubSite = require("../models/subSite.model");

/**
 *  CREATE SITE (OWNER ONLY)
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
 *  GET SITES (ROLE AWARE)
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
      siteId: { $in: siteIds }
    }).lean();

    const response = sites.map(site => {
      // Restrict sub-sites for SUB_SITE_ADMIN to only their allowed list
      const scopedSubSites = subSites
        .filter(sub => sub.siteId === site.siteId)
        .filter(sub => {
          if (admin.role !== "SUB_SITE_ADMIN") return true;
          return (admin.allowedSubSites || []).includes(sub.subSiteId);
        });

      return {
        siteId: site.siteId,
        siteName: site.siteName,
        isActive: site.isActive,
        subSites: scopedSubSites.map(sub => ({
          subSiteId: sub.subSiteId,
          subSiteName: sub.subSiteName,
          isActive: sub.isActive
        }))
      };
    });

    return res.json(response);

  } catch (err) {
    console.error("Get Sites error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 *  DISABLE SITE (OWNER ONLY)
 * PATCH /api/sites/:siteId/disable
 */
exports.disableSite = async (req, res) => {
  try {
    const admin = req.admin;
    const { siteId } = req.params;

    if (admin.role !== "OWNER") {
      return res.status(403).json({ error: "Only OWNER can disable sites" });
    }

    const site = await Site.findOne({ siteId });

    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }

    site.isActive = false;
    await site.save();

    return res.json({
      message: "Site disabled successfully",
      site
    });

  } catch (err) {
    console.error("Disable Site error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 *  ENABLE SITE (OWNER ONLY)
 * PATCH /api/sites/:siteId/enable
 */
exports.enableSite = async (req, res) => {
  try {
    const admin = req.admin;
    const { siteId } = req.params;

    if (admin.role !== "OWNER") {
      return res.status(403).json({ error: "Only OWNER can enable sites" });
    }

    const site = await Site.findOne({ siteId });

    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }

    site.isActive = true;
    await site.save();

    return res.json({
      message: "Site enabled successfully",
      site
    });

  } catch (err) {
    console.error("Enable Site error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 *  DELETE SITE (OWNER ONLY)
 * DELETE /api/sites/:siteId
 */
exports.deleteSite = async (req, res) => {
  try {
    const admin = req.admin;
    const { siteId } = req.params;

    if (admin.role !== "OWNER") {
      return res.status(403).json({ error: "Only OWNER can delete sites" });
    }

    const site = await Site.findOne({ siteId });

    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }

    // Delete all sub-sites first
    await SubSite.deleteMany({ siteId });

    // Delete the site
    await Site.deleteOne({ siteId });

    return res.json({
      message: "Site and all sub-sites deleted permanently"
    });

  } catch (err) {
    console.error("Delete Site error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};