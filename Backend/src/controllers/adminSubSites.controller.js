const Site = require("../models/site.model");
const SubSite = require("../models/subSite.model");

/**
 * ✅ CREATE SUB-SITE
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
 * 📋 GET SUB-SITES OF SITE
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