const Ticket = require("../models/ticket.model");

/*
 *  GET /api/stats
 * Dashboard statistics for admin panel
 * 
 * ROLE-BASED FILTERING:
 * - OWNER: All tickets
 * - SITE_ADMIN: Only tickets from their allowed sites
 * - SUB_SITE_ADMIN: Only tickets from their allowed sites + subsites
 */
exports.getStats = async (req, res) => {
  try {
    const admin = req.admin; // From auth middleware

    /* ============================
       BUILD ROLE-BASED FILTER
    ============================ */
    const filter = {};

    if (admin.role === "SITE_ADMIN") {
      filter.siteId = { $in: admin.allowedSites };
    }

    if (admin.role === "SUB_SITE_ADMIN") {
      filter.siteId = { $in: admin.allowedSites };
      filter.subSiteId = { $in: admin.allowedSubSites };
    }

    // OWNER → no filter, sees all tickets

    /* ============================
       FETCH STATS WITH FILTER
    ============================ */
    const [
      totalTickets,
      openCount,
      inProgressCount,
      resolvedCount,
      closedCount,
      siteWiseStats
    ] = await Promise.all([

      Ticket.countDocuments(filter),

      Ticket.countDocuments({ ...filter, status: "OPEN" }),

      Ticket.countDocuments({ ...filter, status: "IN_PROGRESS" }),

      Ticket.countDocuments({ ...filter, status: "RESOLVED" }),

      Ticket.countDocuments({ ...filter, status: "CLOSED" }),

      Ticket.aggregate([
        { $match: filter },
        {
          $group: {
            _id: "$siteId",
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ])
    ]);

    return res.json({
      totalTickets,
      byStatus: {
        OPEN: openCount,
        IN_PROGRESS: inProgressCount,
        RESOLVED: resolvedCount,
        CLOSED: closedCount
      },
      bySite: siteWiseStats
    });

  } catch (err) {
    console.error("❌ GET /api/stats failed:", err);
    return res.status(500).json({
      error: "Failed to fetch stats"
    });
  }
};