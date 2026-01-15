const TicketReport = require("../models/ticketReport.model");
const Ticket = require("../models/ticket.model");
const Admin = require("../models/admin.model");

/**
 * GET /api/admin/ticket-reports
 * OWNER only - view all ticket reports
 */
exports.getTicketReports = async (req, res) => {
  try {
    const admin = req.admin;

    if (admin.role !== "OWNER") {
      return res.status(403).json({ error: "Only owner can view reports" });
    }

    const { page = 1, limit = 20, status = "pending" } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }

    const [reports, total] = await Promise.all([
      TicketReport.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate("reporterAdminId", "name email role")
        .lean(),

      TicketReport.countDocuments(filter)
    ]);

    // Fetch ticket details for each report
    const ticketIds = reports.map(r => r.ticketId);
    const tickets = await Ticket.find({ ticketId: { $in: ticketIds } }).lean();
    const ticketMap = {};
    tickets.forEach(t => {
      ticketMap[t.ticketId] = t;
    });

    const enrichedReports = reports.map(report => ({
      ...report,
      ticket: ticketMap[report.ticketId] || null
    }));

    return res.json({
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      data: enrichedReports
    });

  } catch (err) {
    console.error("❌ GET /api/admin/ticket-reports failed:", err);
    return res.status(500).json({
      error: "Failed to fetch ticket reports"
    });
  }
};

/**
 * PATCH /api/admin/ticket-reports/:reportId/status
 * OWNER only - update report status
 */
exports.updateReportStatus = async (req, res) => {
  try {
    const admin = req.admin;
    const { reportId } = req.params;
    const { status, note } = req.body;

    if (admin.role !== "OWNER") {
      return res.status(403).json({ error: "Only owner can update report status" });
    }

    if (!["pending", "reviewed", "resolved", "dismissed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const report = await TicketReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    report.status = status;
    if (note) report.ownerNote = note;
    report.reviewedAt = new Date();
    report.reviewedBy = admin._id;
    await report.save();

    return res.json({
      message: "Report status updated",
      report
    });

  } catch (err) {
    console.error("❌ PATCH /api/admin/ticket-reports/:reportId/status failed:", err);
    return res.status(500).json({
      error: "Failed to update report status"
    });
  }
};

/**
 * DELETE /api/admin/ticket-reports/:reportId
 * OWNER only - delete report only (not the ticket)
 */
exports.deleteReport = async (req, res) => {
  try {
    const admin = req.admin;
    const { reportId } = req.params;

    if (admin.role !== "OWNER") {
      return res.status(403).json({ error: "Only owner can delete reports" });
    }

    const report = await TicketReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    await TicketReport.findByIdAndDelete(reportId);

    return res.json({
      message: "Report deleted successfully"
    });

  } catch (err) {
    console.error("❌ DELETE /api/admin/ticket-reports/:reportId failed:", err);
    return res.status(500).json({
      error: "Failed to delete report"
    });
  }
};

/**
 * DELETE /api/admin/ticket-reports/:reportId/ticket
 * OWNER only - delete both ticket and report
 */
exports.deleteTicketFromReport = async (req, res) => {
  try {
    const admin = req.admin;
    const { reportId } = req.params;

    if (admin.role !== "OWNER") {
      return res.status(403).json({ error: "Only owner can delete tickets" });
    }

    const report = await TicketReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Delete the ticket
    const ticket = await Ticket.findOne({ ticketId: report.ticketId });
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    await Ticket.deleteOne({ ticketId: report.ticketId });

    // Delete all reports related to this ticket
    await TicketReport.deleteMany({ ticketId: report.ticketId });

    return res.json({
      message: "Ticket and all associated reports deleted successfully"
    });

  } catch (err) {
    console.error("❌ DELETE /api/admin/ticket-reports/:reportId/ticket failed:", err);
    return res.status(500).json({
      error: "Failed to delete ticket"
    });
  }
};
