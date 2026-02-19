require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const prisma = require("./config/prisma");
const authRoutes = require("./routes/authRoutes");
const staffRoutes = require("./routes/staff.routes");
const studentRoutes = require("./routes/student.routes");

const app = express();

// Required when behind proxies like Render
app.set("trust proxy", 1);

/* ---------------- SECURITY MIDDLEWARE ---------------- */

app.use(helmet());
app.use(compression());

app.use(
  cors({
    origin: "*", // Adjust in production if needed
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("combined"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP
  })
);

/* ---------------- ROUTES ---------------- */

app.use("/api/auth", authRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/students", studentRoutes);

/* ---------------- HEALTH CHECK ---------------- */

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Request App Backend Running",
  });
});

/* ---------------- GLOBAL ERROR HANDLER ---------------- */

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

/* ---------------- START SERVER ---------------- */

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1); // Fail fast if DB is unavailable
  }
}

startServer();
