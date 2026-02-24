require("dotenv").config();
const express = require("express");
const cors = require("cors");
const prisma = require("./config/prisma");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================================================
   GLOBAL MIDDLEWARE
========================================================= */

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

/* =========================================================
   API ROUTES
========================================================= */

app.use("/api", routes);

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

/* =========================================================
   START SERVER
========================================================= */

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