const { generateSiteQR } = require("../utils/qr.generator");

/**
 * Generate QR code for a site (with optional sub-site)
 * GET /api/sites/:siteId/qr
 * GET /api/sites/:siteId/subsites/:subSiteId/qr
 */
async function generateQRCode(req, res) {
  try {
    const { siteId, subSiteId } = req.params;
    
    // Get WhatsApp number from environment (remove + sign for wa.me)
    let whatsappNumber = process.env.PHONE_NUMBER || "+918741843979";
    
    // Remove + sign if present for wa.me link format
    whatsappNumber = whatsappNumber.replace(/\+/g, '');
    
    // Validate phone number
    if (!whatsappNumber || whatsappNumber.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Invalid WhatsApp phone number configuration"
      });
    }
    
    // Generate QR code
    const qrData = await generateSiteQR({
      whatsappNumber,
      siteId,
      subSiteId
    });
    
    return res.status(200).json({
      success: true,
      data: {
        siteId,
        subSiteId,
        qrDataUrl: qrData.qrDataUrl,
        waLink: qrData.waLink
      }
    });
  } catch (error) {
    console.error("❌ QR Generation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate QR code"
    });
  }
}

module.exports = { generateQRCode };
