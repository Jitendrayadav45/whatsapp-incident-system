const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth.middleware");

/*  AUTH */
const { login } = require("../controllers/adminAuth.controller");
router.post("/auth/login", login);

/*  PROTECTED ROUTES */
router.use(adminAuth);

/* TICKETS */
const {
  getTickets,
  getTicketByTicketId,
  deleteTicketByTicketId,
  reportTicket
} = require("../controllers/adminTickets.controller");

const {
  updateTicketStatus
} = require("../controllers/adminTicketStatus.controller");

router.get("/tickets", getTickets);
router.get("/tickets/:ticketId", getTicketByTicketId);
router.delete("/tickets/:ticketId", deleteTicketByTicketId);
router.post("/tickets/:ticketId/report", reportTicket);
router.patch("/tickets/:ticketId/status", updateTicketStatus);

/*  TICKET REPORTS */
const {
  getTicketReports,
  updateReportStatus,
  deleteReport,
  deleteTicketFromReport
} = require("../controllers/adminTicketReports.controller");

router.get("/ticket-reports", getTicketReports);
router.patch("/ticket-reports/:reportId/status", updateReportStatus);
router.delete("/ticket-reports/:reportId", deleteReport);
router.delete("/ticket-reports/:reportId/ticket", deleteTicketFromReport);

/*  STATS */
const { getStats } = require("../controllers/adminStats.controller");
router.get("/stats", getStats);

/*  SITES */
const {
  getSites,
  createSite,
  disableSite,
  enableSite,
  deleteSite
} = require("../controllers/adminSites.controller");

router.get("/sites", getSites);
router.post("/sites", createSite);
router.patch("/sites/:siteId/disable", disableSite);
router.patch("/sites/:siteId/enable", enableSite);
router.delete("/sites/:siteId", deleteSite);

/*  SUB-SITES */
const {
  createSubSite,
  getSubSitesBySite,
  disableSubSite,
  enableSubSite,
  deleteSubSite
} = require("../controllers/adminSubSites.controller");

router.get("/sites/:siteId/subsites", getSubSitesBySite);
router.post("/sites/:siteId/subsites", createSubSite);
router.patch("/sites/:siteId/subsites/:subSiteId/disable", disableSubSite);
router.patch("/sites/:siteId/subsites/:subSiteId/enable", enableSubSite);
router.delete("/sites/:siteId/subsites/:subSiteId", deleteSubSite);

/*  ADMIN MANAGEMENT */
const {
  getAdmins,
  createAdmin,
  updateAdminStatus,
  deleteAdmin,
  resetAdminPassword
} = require("../controllers/adminManagement.controller");

router.get("/admins", getAdmins);
router.post("/admins", createAdmin);
router.patch("/admins/:adminId/status", updateAdminStatus);
router.delete("/admins/:adminId", deleteAdmin);
router.patch("/admins/:adminId/reset-password", resetAdminPassword);

/*  QR CODE GENERATION */
const { generateQRCode } = require("../controllers/adminQR.controller");

router.get("/sites/:siteId/qr", generateQRCode);
router.get("/sites/:siteId/subsites/:subSiteId/qr", generateQRCode);

module.exports = router;