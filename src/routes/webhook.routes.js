const express = require("express");
const router = express.Router();

// ✅ CORRECT IMPORT
const webhookController = require("../controllers/webhook.controller");

// Webhook verification
router.get("/webhook", webhookController.verifyWebhook);

// Incoming WhatsApp messages
router.post("/webhook", webhookController.receiveMessage);

module.exports = router;
