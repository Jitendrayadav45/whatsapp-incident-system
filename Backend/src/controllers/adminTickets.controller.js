const Ticket = require("../models/ticket.model");
const TicketReport = require("../models/ticketReport.model");

/**
 *  GET /api/admin/tickets
 * Query Params (optional):
 *  - siteId
 *  - status
 *  - page (default: 1)
 *  - limit (default: 20)
 */
exports.getTickets = async (req, res) => {
  try {
    const admin = req.admin;

    const {
      siteId,
      status,
      search,
      page = 1,
      limit = 20
    } = req.query;

    const filter = {};

    const escapeRegExp = (value = "") =>
      value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    /* ============================
       ROLE-BASED SCOPE (MANDATORY)
    ============================ */

    if (admin.role === "SITE_ADMIN") {
      filter.siteId = { $in: admin.allowedSites };
    }

    if (admin.role === "SUB_SITE_ADMIN") {
      filter.siteId = { $in: admin.allowedSites };
      filter.subSiteId = { $in: admin.allowedSubSites };
    }

    // OWNER → no restriction

    /* 
        OPTIONAL QUERY REFINEMENTS
       (applied AFTER role scope)
   */

    if (siteId) {
      filter.siteId = siteId;
    }

    if (status) {
      filter.status = status;
    }

    if (search && search.trim()) {
      const safeSearch = escapeRegExp(search.trim());
      filter.ticketId = { $regex: safeSearch, $options: "i" };
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [tickets, total] = await Promise.all([
      Ticket.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),

      Ticket.countDocuments(filter)
    ]);

    return res.json({
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      data: tickets
    });

  } catch (err) {
    console.error("❌ GET /api/admin/tickets failed:", err);
    return res.status(500).json({
      error: "Failed to fetch tickets"
    });
  }
};

/**
 *  DELETE /api/admin/tickets/:ticketId
 *  OWNER only
 */
exports.deleteTicketByTicketId = async (req, res) => {
  try {
    const admin = req.admin;
    const { ticketId } = req.params;

    if (admin.role !== "OWNER") {
      return res.status(403).json({ error: "Only owner can delete tickets" });
    }

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    await Ticket.deleteOne({ _id: ticket._id });
    await TicketReport.deleteMany({ ticketId }); // clean up associated reports

    return res.json({
      message: "Ticket deleted successfully",
      ticketId
    });
  } catch (err) {
    console.error("❌ DELETE /api/admin/tickets/:ticketId failed:", err);
    return res.status(500).json({ error: "Failed to delete ticket" });
  }
};

/**
 *  POST /api/admin/tickets/:ticketId/report
 *  SITE_ADMIN / SUB_SITE_ADMIN (or owner if needed)
 */
exports.reportTicket = async (req, res) => {
  try {
    const admin = req.admin;
    const { ticketId } = req.params;
    const { reason } = req.body || {};

    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: "Reason is required" });
    }

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Role checks: owner allowed, site/sub-site scoped
    if (admin.role === "SITE_ADMIN") {
      if (!admin.allowedSites?.includes(ticket.siteId)) {
        return res.status(403).json({ error: "Access denied for this site" });
      }
    } else if (admin.role === "SUB_SITE_ADMIN") {
      if (
        !admin.allowedSites?.includes(ticket.siteId) ||
        !admin.allowedSubSites?.includes(ticket.subSiteId)
      ) {
        return res.status(403).json({ error: "Access denied for this sub-site" });
      }
    } else if (admin.role !== "OWNER") {
      return res.status(403).json({ error: "Invalid admin role" });
    }

    const report = await TicketReport.create({
      ticketId,
      siteId: ticket.siteId,
      subSiteId: ticket.subSiteId,
      reporterAdminId: admin._id,
      reporterRole: admin.role,
      reason: reason.trim()
    });

    return res.status(201).json({
      message: "Ticket reported",
      reportId: report._id,
      ticketId
    });
  } catch (err) {
    console.error("❌ POST /api/admin/tickets/:ticketId/report failed:", err);
    return res.status(500).json({ error: "Failed to report ticket" });
  }
};

/**
 *  GET /api/admin/tickets/:ticketId
 * Returns single ticket (ROLE AWARE)
 */
exports.getTicketByTicketId = async (req, res) => {
  try {
    const admin = req.admin;
    const { ticketId } = req.params;

    const filter = { ticketId };

   
        // ROLE-BASED SCOPE
  

    if (admin.role === "SITE_ADMIN") {
      filter.siteId = { $in: admin.allowedSites };
    }

    if (admin.role === "SUB_SITE_ADMIN") {
      filter.siteId = { $in: admin.allowedSites };
      filter.subSiteId = { $in: admin.allowedSubSites };
    }

    const ticket = await Ticket.findOne(filter).lean();

    if (!ticket) {
      return res.status(404).json({
        error: "Ticket not found"
      });
    }

    return res.json(ticket);

  } catch (err) {
    console.error("❌ GET /api/admin/tickets/:ticketId failed:", err);
    return res.status(500).json({
      error: "Failed to fetch ticket"
    });
  }
};