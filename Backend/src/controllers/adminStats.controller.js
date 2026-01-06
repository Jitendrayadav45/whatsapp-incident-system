const Ticket = require("../models/ticket.model");

/**
 * =====================================================
 * 📊 GET /api/stats
 * -----------------------------------------------------
 * Dashboard statistics for admin
 * =====================================================
 */
exports.getStats = async (req, res) => {
  try {
    const [
      totalTickets,
      openCount,
      inProgressCount,
      resolvedCount,
      siteWiseStats
    ] = await Promise.all([

      Ticket.countDocuments(),

      Ticket.countDocuments({ status: "OPEN" }),

      Ticket.countDocuments({ status: "IN_PROGRESS" }),

      Ticket.countDocuments({ status: "RESOLVED" }),

      Ticket.aggregate([
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
        RESOLVED: resolvedCount
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