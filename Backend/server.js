require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const adminRoutes = require("./src/routes/admin.routes");
const webhookRoutes = require("./src/routes/webhook.routes");

const app = express();
app.use(express.json());

// DB connect
connectDB();

// routes
app.use("/webhook", webhookRoutes);
app.use("/api", adminRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
