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
app.set("trust proxy", 1);


/* ---------------- SECURITY ---------------- */

app.use(helmet());
app.use(compression());

app.use(cors({
  origin: "*", // for mobile apps
  credentials: true
}));

app.use(express.json());
app.use(morgan("combined"));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
}));

/* ---------------- ROUTES ---------------- */

app.use("/api/auth", authRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/students", studentRoutes);

/* ---------------- HEALTH CHECK ---------------- */

app.get("/", (req, res) => {
  res.json({ message: "Request App Backend Running" });
});

/* ---------------- ERROR HANDLER ---------------- */

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

/* ---------------- START SERVER ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error("Database connection failed", error);
  }
});
