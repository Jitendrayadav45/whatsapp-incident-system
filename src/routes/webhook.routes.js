const express = require("express");
const router = express.Router();

const webhookController = require("../controllers/webhook.controller");

// Meta Webhook Verification
router.get("/", webhookController.verifyWebhook);

// Incoming WhatsApp Messages
router.post("/", webhookController.receiveMessage);

module.exports = router;
