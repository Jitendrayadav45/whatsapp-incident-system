const Ticket = require("../models/ticket.model");

/**
 * =====================================================
 * 🎫 GET /api/admin/tickets
 * -----------------------------------------------------
 * Query Params (optional):
 *  - siteId
 *  - status
 *  - page (default: 1)
 *  - limit (default: 20)
 * =====================================================
 */
exports.getTickets = async (req, res) => {
  try {
    const admin = req.admin;

    const {
      siteId,
      status,
      page = 1,
      limit = 20
    } = req.query;

    const filter = {};

    /* ============================
       🔐 ROLE-BASED SCOPE (MANDATORY)
    ============================ */

    if (admin.role === "SITE_ADMIN") {
      filter.siteId = { $in: admin.allowedSites };
    }

    if (admin.role === "SUB_SITE_ADMIN") {
      filter.siteId = { $in: admin.allowedSites };
      filter.subSiteId = { $in: admin.allowedSubSites };
    }

    // OWNER → no restriction

    /* ============================
       🔎 OPTIONAL QUERY REFINEMENTS
       (applied AFTER role scope)
    ============================ */

    if (siteId) {
      filter.siteId = siteId;
    }

    if (status) {
      filter.status = status;
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
 * =====================================================
 * 🎫 GET /api/admin/tickets/:ticketId
 * -----------------------------------------------------
 * Returns single ticket (ROLE AWARE)
 * =====================================================
 */
exports.getTicketByTicketId = async (req, res) => {
  try {
    const admin = req.admin;
    const { ticketId } = req.params;

    const filter = { ticketId };

    /* ============================
       🔐 ROLE-BASED SCOPE
    ============================ */

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