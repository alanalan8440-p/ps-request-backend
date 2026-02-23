require("dotenv").config();

const express = require("express");
const prisma = require("./config/prisma");

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------------- MIDDLEWARE ---------------- */

app.use(express.json());

/* ---------------- ROUTES ---------------- */

// ✅ Correct path (matches your folder structure)
const authRoutes = require("./modules/auth/auth.routes");

app.use("/api/auth", authRoutes);

/* ---------------- HEALTH CHECK ---------------- */

app.get("/", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/* ---------------- START SERVER ---------------- */

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

startServer();