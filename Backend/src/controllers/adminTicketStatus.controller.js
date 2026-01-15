const Ticket = require("../models/ticket.model");
const { uploadImageBase64 } = require("../services/cloudinary.service");

/**
 * =====================================================
 *  PATCH /api/tickets/:ticketId/status
 * =====================================================
 * Uses req.admin from auth middleware
 * Body:
 *  { 
 *    "status": "IN_PROGRESS" | "RESOLVED" | "CLOSED",
 *    "resolutionPhoto": "base64string" (required for RESOLVED),
 *    "resolutionNotes": "text" (optional for RESOLVED)
 *  }
 * =====================================================
 */
exports.updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, resolutionPhoto, resolutionNotes } = req.body;

    const admin = req.admin; // From auth middleware

    /* ======================
       BASIC VALIDATIONS
    ====================== */
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    if (!["IN_PROGRESS", "RESOLVED", "CLOSED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // RESOLVED requires photo
    if (status === "RESOLVED" && !resolutionPhoto) {
      return res.status(400).json({ 
        error: "Resolution photo is required to resolve ticket" 
      });
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
      RESOLVED: ["CLOSED"],
      CLOSED: []
    };

    const allowedNextStatuses = validTransitions[currentStatus];
    if (!allowedNextStatuses) {
      return res.status(400).json({
        error: `Unknown current status ${currentStatus}`
      });
    }

    if (!allowedNextStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status transition from ${currentStatus} to ${status}`
      });
    }

    /* ======================
       CLOSING PERMISSION CHECK
    ====================== */
    // Only OWNER and SITE_ADMIN can close tickets
    if (status === "CLOSED") {
      if (admin.role !== "OWNER" && admin.role !== "SITE_ADMIN") {
        return res.status(403).json({
          error: "Only OWNER and SITE_ADMIN can close tickets"
        });
      }
    }

    /* ======================
       HANDLE RESOLUTION PHOTO
    ====================== */
    if (status === "RESOLVED" && resolutionPhoto) {
      try {
        const uploadResult = await uploadImageBase64({
          base64: resolutionPhoto,
          mimeType: "image/jpeg"
        });

        if (uploadResult && uploadResult.url) {
          ticket.resolutionDetails = {
            photoUrl: uploadResult.url,
            notes: resolutionNotes || "",
            resolvedBy: admin.username,
            resolvedAt: new Date()
          };
        } else {
          return res.status(500).json({
            error: "Failed to upload resolution photo"
          });
        }
      } catch (uploadErr) {
        console.error("❌ Photo upload failed:", uploadErr);
        return res.status(500).json({
          error: "Failed to upload resolution photo"
        });
      }
    }

    /* ======================
       UPDATE
    ====================== */
    ticket.status = status;
    // Legacy tickets may miss required fields (e.g., phone). Only validate modified paths.
    await ticket.save({ validateModifiedOnly: true });

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