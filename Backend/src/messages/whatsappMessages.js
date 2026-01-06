module.exports = {
  /* =====================================================
     👋 ENTRY / FIRST CONTACT (NO QR / HELLO MESSAGE)
  ===================================================== */

  WELCOME_MESSAGE: `
Hello 👋
This is the Incident Reporting System (Sentinel).

To report an issue, please write site name and describe the problem with an image after scanning the QR code displayed at your site.

Example:
SITE:GITA|SUB:GITA1 Oil leakage near machine.
`,

  /* =====================================================
     ❌ VALIDATION & GUIDANCE (POLITE BLOCKS)
  ===================================================== */

  SITE_MISSING_MESSAGE: `
⚠️ We couldn’t identify the site for this issue.

Please scan the QR code displayed at your site and then send the message again.

If the problem is urgent, inform your site supervisor.
`,

  INVALID_SITE_MESSAGE: `
⚠️ Site not recognized.

Please scan the QR code displayed at your site.
If the issue persists, contact the site administrator.

No ticket has been created.
`,

  SUBSITE_NOT_FOUND_MESSAGE: `
⚠️ Sub-site not recognized.

Please ensure you scanned the correct QR code for your sub-site.
If the issue persists, contact the site administrator.

No ticket has been created.
`,

  ISSUE_TOO_SHORT_MESSAGE: `
⚠️ Please describe the issue briefly after scanning the QR code.

Example:
SITE:GITA|SUB:GITA1 Oil leakage near machine.
`,

  STATUS_NOT_FOUND_MESSAGE: `
❌ Ticket not found.

Please check your Ticket ID and try again.
`,

  /* =====================================================
     🎫 TICKET CONFIRMATION (BASE MESSAGE)
     (Used before AI insights are added)
  ===================================================== */

  TICKET_SUCCESS_BASE: ({ ticketId, siteId, subSiteId, issue }) => `
✅ Your issue has been reported successfully.

Ticket ID: ${ticketId}
Site: ${siteId}${subSiteId ? " / " + subSiteId : ""}
Issue: ${issue}
`,

  /* =====================================================
     🔁 SOFT DUPLICATE WARNING (OPTION-C)
  ===================================================== */

  DUPLICATE_WARNING_MESSAGE: ({ oldTicketId, newTicketId }) => `
ℹ️ We’ve received your report.

A similar issue was reported recently (Ticket ${oldTicketId}).

We’ve still created a new ticket to make sure nothing is missed.

New Ticket ID: ${newTicketId}
`,

  /* =====================================================
     📎 MEDIA CONFIRMATIONS (PROFESSIONAL ACKS)
  ===================================================== */

  IMAGE_CONFIRMATION_MESSAGE: `
📸 Image received.

Your photo has been attached to the ticket.
This will help the team understand the issue better.
`,

  AUDIO_CONFIRMATION_MESSAGE: `
🎙️ Voice message received.

Your message has been shared with the site team.
`,

  VIDEO_CONFIRMATION_MESSAGE: `
🎥 Video received.

Thank you for providing additional details.
`,

  DOCUMENT_CONFIRMATION_MESSAGE: `
📄 Document received.

Your file has been attached to the ticket for reference.
`,

  /* =====================================================
     🧠 AI SAFETY INSIGHTS (MENTOR TONE)
  ===================================================== */

  AI_WARNING_MESSAGE: (ai) => `
⚠️ Safety Insight (Advisory)

Potential Life-Saving Rule involved:
${ai.ruleName}

Why this matters:
${ai.whyThisIsDangerous}

Recommended precautions:
${ai.mentorPrecautions.map(p => `• ${p}`).join("\n")}
`,

  AI_CLEAR_MESSAGE: `
ℹ️ Safety Insight

No immediate Life-Saving Rule violation was identified.
Your observation has been shared with the safety team for review.
`,

  /* =====================================================
     🔎 STATUS COMMAND RESPONSE
  ===================================================== */

  STATUS_REPLY_MESSAGE: (ticket) => {
    const updatedAt = new Date(ticket.updatedAt);

    const formatted = updatedAt.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata"
    });

    return `
🎫 Ticket ID: ${ticket.ticketId}
Status: ${ticket.status}
Last Updated: ${formatted} IST
`;
  },

  /* =====================================================
     🧾 STANDARD FOOTER (TRUST + NEXT ACTION)
  ===================================================== */

  FOOTER_MESSAGE: `
The site safety team has been notified.

Please keep this Ticket ID for reference.
You can check the status anytime by typing:

status <Ticket ID>

Thank you for helping keep the site safe.
`,

  /* =====================================================
     🚨 SYSTEM / FALLBACK (NO TECH DETAILS)
  ===================================================== */

  SYSTEM_ERROR_MESSAGE: `
⚠️ We’re facing a temporary issue while processing your request.

Please try again after a few minutes or inform your site supervisor.
`
};


