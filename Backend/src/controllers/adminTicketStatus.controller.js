const Ticket = require("../models/ticket.model");

/**
 * =====================================================
 * 🔄 PATCH /api/tickets/:ticketId/status
 * =====================================================
 * Uses req.admin from auth middleware
 * Body:
 *  { "status": "IN_PROGRESS" | "RESOLVED" }
 * =====================================================
 */
exports.updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const admin = req.admin; // From auth middleware

    /* ======================
       BASIC VALIDATIONS
    ====================== */
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    if (!["IN_PROGRESS", "RESOLVED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const ticket = await Ticket.findOne({ ticketId });

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    /* ======================
       ROLE BASED ACCESS
    ====================== */

    // OWNER → Full access
    if (admin.role === "OWNER") {
      // allowed
    }

    // SITE_ADMIN → Same site only
    else if (admin.role === "SITE_ADMIN") {
      if (!admin.allowedSites?.includes(ticket.siteId)) {
        return res.status(403).json({
          error: "Access denied for this site"
        });
      }
    }

    // SUB_SITE_ADMIN → Same site + same subsite
    else if (admin.role === "SUB_SITE_ADMIN") {
      if (
        !admin.allowedSites?.includes(ticket.siteId) ||
        !admin.allowedSubSites?.includes(ticket.subSiteId)
      ) {
        return res.status(403).json({
          error: "Access denied for this sub-site"
        });
      }
    }

    else {
      return res.status(403).json({
        error: "Invalid admin role"
      });
    }

    /* ======================
       STATUS TRANSITION RULES
    ====================== */
    const currentStatus = ticket.status;

    const validTransitions = {
      OPEN: ["IN_PROGRESS"],
      IN_PROGRESS: ["RESOLVED"],
      RESOLVED: []
    };

    if (!validTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        error: `Invalid status transition from ${currentStatus} to ${status}`
      });
    }

    /* ======================
       UPDATE
    ====================== */
    ticket.status = status;
    await ticket.save();

    return res.json({
      message: "Ticket status updated successfully",
      ticketId: ticket.ticketId,
      newStatus: ticket.status,
      updatedAt: ticket.updatedAt
    });

  } catch (err) {
    console.error("❌ PATCH /tickets/:ticketId/status failed:", err);
    return res.status(500).json({
      error: "Failed to update ticket status"
    });
  }
};