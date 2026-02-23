require("dotenv").config();
const express = require("express");
const prisma = require("./config/prisma");

const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Mount all routes
app.use("/api", routes);



app.get("/", (req, res) => {
  res.status(200).json({ status: "OK" });
});

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