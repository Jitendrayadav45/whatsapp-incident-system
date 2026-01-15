const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AdminUser = require("../models/admin.model");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = "12h";

async function loginAdmin({ email, password }) {
  const user = await AdminUser.findOne({ email, isActive: true });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
      allowedSites: user.allowedSites || [],
      allowedSubSites: user.allowedSubSites || []
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );

  return {
    token,
    user: {
      name: user.name,
      role: user.role,
      allowedSites: user.allowedSites || [],
      allowedSubSites: user.allowedSubSites || []
    }
  };
}

module.exports = { loginAdmin };