const { loginAdmin } = require("../services/adminAuth.service");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const result = await loginAdmin({ email, password });

    return res.json(result);

  } catch (err) {
    return res.status(401).json({
      error: "Invalid email or password"
    });
  }
};