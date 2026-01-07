const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");

module.exports = async function adminAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const adminId = decoded.id || decoded.userId;
    const admin = adminId ? await Admin.findById(adminId).lean() : null;
    if (!admin || !admin.isActive) {
      return res.status(401).json({ error: "Invalid admin" });
    }

    req.admin = admin; // 🔑 inject admin context
    next();

  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};