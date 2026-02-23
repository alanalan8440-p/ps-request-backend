require("dotenv").config();
const express = require("express");
const prisma = require("./config/prisma");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json());

// ✅ ROUTES IMPORT
const authRoutes = require("./modules/auth/auth.js"); 
// adjust path if needed

// ✅ MOUNT ROUTES
app.use("/api", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ status: "OK" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// DB connect
prisma.$connect()
  .then(() => console.log("Database connected"))
  .catch((err) => {
    console.error("Database connection failed:", err);
  });