const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

/* ===============================
   MIDDLEWARE
=============================== */

// Allow cross-origin requests
app.use(cors());

// 🔥 THIS IS CRITICAL (Fixes your login error)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===============================
   ROUTES
=============================== */

app.use("/api", routes);

/* ===============================
   GLOBAL ERROR HANDLER
=============================== */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;