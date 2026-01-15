const Admin = require("../models/admin.model");
const bcrypt = require("bcryptjs");

/**
 * GET ALL ADMINS
 * OWNER → all admins
 * SITE_ADMIN → admins in their sites only
 */
exports.getAdmins = async (req, res) => {
  try {
    const admin = req.admin;

    let query = {};

    if (admin.role === "SITE_ADMIN") {
      // Show only admins in their allowed sites
      query.allowedSites = { $in: admin.allowedSites || [] };
    } else if (admin.role === "SUB_SITE_ADMIN") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const admins = await Admin.find(query)
      .select("-passwordHash")
      .lean();

    return res.json(admins);

  } catch (err) {
    console.error("Get admins error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * CREATE ADMIN
 * OWNER → can create SITE_ADMIN and SUB_SITE_ADMIN
 * SITE_ADMIN → can create SUB_SITE_ADMIN in their sites only
 */
exports.createAdmin = async (req, res) => {
  try {
    const admin = req.admin;
    const { name, email, password, role, allowedSites, allowedSubSites } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "name, email, password, and role are required" });
    }

    if (!["SITE_ADMIN", "SUB_SITE_ADMIN"].includes(role)) {
      return res.status(400).json({ error: "Invalid role. Only SITE_ADMIN and SUB_SITE_ADMIN can be created" });
    }

    // Permission check
    if (admin.role === "SITE_ADMIN") {
      // SITE_ADMIN can only create SUB_SITE_ADMIN
      if (role !== "SUB_SITE_ADMIN") {
        return res.status(403).json({ error: "You can only create SUB_SITE_ADMIN" });
      }

      // SITE_ADMIN can only assign their own sites
      const requestedSites = allowedSites || [];
      const invalidSites = requestedSites.filter(s => !admin.allowedSites?.includes(s));
      
      if (invalidSites.length > 0) {
        return res.status(403).json({ 
          error: `You can only assign sites you have access to: ${invalidSites.join(", ")}` 
        });
      }
    }

    // Check if email already exists
    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin
    const newAdmin = await Admin.create({
      name,
      email,
      passwordHash,
      role,
      allowedSites: allowedSites || [],
      allowedSubSites: allowedSubSites || [],
      isActive: true
    });

    // Return without password
    const result = newAdmin.toObject();
    delete result.passwordHash;

    return res.status(201).json(result);

  } catch (err) {
    console.error("Create admin error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 *  UPDATE ADMIN STATUS (ACTIVATE/DEACTIVATE)
 * OWNER → can update any admin
 * SITE_ADMIN → can update admins in their sites only
 */
exports.updateAdminStatus = async (req, res) => {
  try {
    const admin = req.admin;
    const { adminId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ error: "isActive must be true or false" });
    }

    const targetAdmin = await Admin.findById(adminId);

    if (!targetAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Permission check
    if (admin.role === "SITE_ADMIN") {
      // SITE_ADMIN can only update admins in their sites
      const hasAccess = targetAdmin.allowedSites?.some(s => admin.allowedSites?.includes(s));
      
      if (!hasAccess) {
        return res.status(403).json({ error: "Not authorized to update this admin" });
      }
    } else if (admin.role === "SUB_SITE_ADMIN") {
      return res.status(403).json({ error: "Not authorized" });
    }

    targetAdmin.isActive = isActive;
    await targetAdmin.save();

    const result = targetAdmin.toObject();
    delete result.passwordHash;

    return res.json(result);

  } catch (err) {
    console.error("Update admin status error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * DELETE ADMIN
 * OWNER → can delete any admin (except other owners)
 */
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = req.admin;
    const { adminId } = req.params;

    // Only OWNER can delete admins
    if (admin.role !== "OWNER") {
      return res.status(403).json({ error: "Only OWNER can delete admin users" });
    }

    const targetAdmin = await Admin.findById(adminId);

    if (!targetAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Cannot delete OWNER accounts
    if (targetAdmin.role === "OWNER") {
      return res.status(403).json({ error: "Cannot delete OWNER account" });
    }

    // Cannot delete yourself
    if (targetAdmin._id.toString() === admin._id.toString()) {
      return res.status(403).json({ error: "Cannot delete your own account" });
    }

    await Admin.deleteOne({ _id: adminId });

    return res.json({ message: "Admin deleted successfully", adminId });

  } catch (err) {
    console.error("Delete admin error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 *  RESET ADMIN PASSWORD
 * OWNER → can reset password for any admin (except other owners)
 */
exports.resetAdminPassword = async (req, res) => {
  try {
    const admin = req.admin;
    const { adminId } = req.params;
    const { newPassword } = req.body;

    // Only OWNER can reset passwords
    if (admin.role !== "OWNER") {
      return res.status(403).json({ error: "Only OWNER can reset passwords" });
    }

    // Validation
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const targetAdmin = await Admin.findById(adminId);

    if (!targetAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Cannot reset OWNER passwords
    if (targetAdmin.role === "OWNER") {
      return res.status(403).json({ error: "Cannot reset OWNER password" });
    }

    // Hash new password
    const bcrypt = require("bcryptjs");
    const passwordHash = await bcrypt.hash(newPassword, 10);
    targetAdmin.passwordHash = passwordHash;
    await targetAdmin.save();

    return res.json({ 
      message: "Password reset successfully",
      adminId: targetAdmin._id,
      adminName: targetAdmin.name
    });

  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
