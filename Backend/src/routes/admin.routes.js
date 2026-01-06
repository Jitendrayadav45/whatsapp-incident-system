const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth.middleware");

/* 🔓 AUTH */
const { login } = require("../controllers/adminAuth.controller");
router.post("/auth/login", login);

/* 🔐 PROTECTED ROUTES */
router.use(adminAuth);

/* 🎫 TICKETS */
const {
  getTickets,
  getTicketByTicketId
} = require("../controllers/adminTickets.controller");

const {
  updateTicketStatus
} = require("../controllers/adminTicketStatus.controller");

router.get("/tickets", getTickets);
router.get("/tickets/:ticketId", getTicketByTicketId);
router.patch("/tickets/:ticketId/status", updateTicketStatus);

/* 📊 STATS */
const { getStats } = require("../controllers/adminStats.controller");
router.get("/stats", getStats);

/* 🏭 SITES */
const {
  getSites,
  createSite
} = require("../controllers/adminSites.controller");

router.get("/sites", getSites);
router.post("/sites", createSite);

/* 🏗 SUB-SITES */
const {
  createSubSite,
  getSubSitesBySite
} = require("../controllers/adminSubSites.controller");

router.get("/sites/:siteId/subsites", getSubSitesBySite);
router.post("/sites/:siteId/subsites", createSubSite);

module.exports = router;