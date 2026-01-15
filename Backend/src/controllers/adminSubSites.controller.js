const Site = require("../models/site.model");
const SubSite = require("../models/subSite.model");

/**
 *  CREATE SUB-SITE
 * OWNER → any site
 * SITE_ADMIN → own site only
 */
exports.createSubSite = async (req, res) => {
  try {
    const admin = req.admin;
    const { siteId } = req.params;
    const { subSiteId, subSiteName, description } = req.body;

    if (!["OWNER", "SITE_ADMIN"].includes(admin.role)) {
      return res.status(403).json({ error: "Not allowed" });
    }

    if (
      admin.role === "SITE_ADMIN" &&
      !admin.allowedSites?.includes(siteId)
    ) {
      return res.status(403).json({ error: "Not authorized for this site" });
    }

    if (!subSiteId || !subSiteName) {
      return res.status(400).json({ error: "subSiteId and subSiteName required" });
    }

    const siteExists = await Site.exists({ siteId, isActive: true });
    if (!siteExists) {
      return res.status(404).json({ error: "Site not found or inactive" });
    }

    const exists = await SubSite.exists({
      siteId,
      subSiteId: subSiteId.toUpperCase()
    });

    if (exists) {
      return res.status(409).json({ error: "SubSite already exists" });
    }

    const subSite = await SubSite.create({
      siteId,
      subSiteId: subSiteId.toUpperCase(),
      subSiteName,
      description: description || null,
      createdBy: admin._id
    });

    return res.status(201).json({
      message: "SubSite created successfully",
      subSite
    });

  } catch (err) {
    console.error("Create SubSite error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 *  GET SUB-SITES OF SITE
 */
exports.getSubSitesBySite = async (req, res) => {
  try {
    const admin = req.admin;
    const { siteId } = req.params;

    if (
      admin.role !== "OWNER" &&
      !admin.allowedSites?.includes(siteId)
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const subs = await SubSite.find({
      siteId,
      isActive: true
    }).lean();

    return res.json(subs);

  } catch (err) {
    console.error("Get SubSites error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 *  DISABLE SUB-SITE (OWNER / SITE_ADMIN)
 * PATCH /api/sites/:siteId/subsites/:subSiteId/disable
 */
exports.disableSubSite = async (req, res) => {
  try {
    const admin = req.admin;
    const { siteId, subSiteId } = req.params;

    if (![
      "OWNER", "SITE_ADMIN"].includes(admin.role)) {
      return res.status(403).json({ error: "Not allowed" });
    }

    if (
      admin.role === "SITE_ADMIN" &&
      !admin.allowedSites?.includes(siteId)
    ) {
      return res.status(403).json({ error: "Not authorized for this site" });
    }

    const subSite = await SubSite.findOne({ siteId, subSiteId });

    if (!subSite) {
      return res.status(404).json({ error: "SubSite not found" });
    }

    subSite.isActive = false;
    await subSite.save();

    return res.json({
      message: "SubSite disabled successfully",
      subSite
    });

  } catch (err) {
    console.error("Disable SubSite error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 *  ENABLE SUB-SITE (OWNER / SITE_ADMIN)
 * PATCH /api/sites/:siteId/subsites/:subSiteId/enable
 */
exports.enableSubSite = async (req, res) => {
  try {
    const admin = req.admin;
    const { siteId, subSiteId } = req.params;

    if (![
      "OWNER", "SITE_ADMIN"].includes(admin.role)) {
      return res.status(403).json({ error: "Not allowed" });
    }

    if (
      admin.role === "SITE_ADMIN" &&
      !admin.allowedSites?.includes(siteId)
    ) {
      return res.status(403).json({ error: "Not authorized for this site" });
    }

    const subSite = await SubSite.findOne({ siteId, subSiteId });

    if (!subSite) {
      return res.status(404).json({ error: "SubSite not found" });
    }

    subSite.isActive = true;
    await subSite.save();

    return res.json({
      message: "SubSite enabled successfully",
      subSite
    });

  } catch (err) {
    console.error("Enable SubSite error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 *  DELETE SUB-SITE (OWNER / SITE_ADMIN)
 * DELETE /api/sites/:siteId/subsites/:subSiteId
 */
exports.deleteSubSite = async (req, res) => {
  try {
    const admin = req.admin;
    const { siteId, subSiteId } = req.params;

    if (![
      "OWNER", "SITE_ADMIN"].includes(admin.role)) {
      return res.status(403).json({ error: "Not allowed" });
    }

    if (
      admin.role === "SITE_ADMIN" &&
      !admin.allowedSites?.includes(siteId)
    ) {
      return res.status(403).json({ error: "Not authorized for this site" });
    }

    const subSite = await SubSite.findOne({ siteId, subSiteId });

    if (!subSite) {
      return res.status(404).json({ error: "SubSite not found" });
    }

    await SubSite.deleteOne({ siteId, subSiteId });

    return res.json({
      message: "SubSite deleted permanently"
    });

  } catch (err) {
    console.error("Delete SubSite error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};