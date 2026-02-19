require("dotenv").config();
const express = require("express");
const prisma = require("./config/prisma");

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({ status: "OK" });
});

// Start server FIRST
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Then connect DB (non-blocking)
prisma.$connect()
  .then(() => console.log("Database connected"))
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
