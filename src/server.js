require("dotenv").config();
const express = require("express");
const prisma = require("./config/prisma");

const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Mount all routes
app.use("/api", routes);

// ✅ TEMP TEST ROUTE (for creating one student)
app.get("/api/create-test-student", async (req, res) => {
  try {
    const bcrypt = require("bcrypt");

    const hashedPassword = await bcrypt.hash("123456", 10);

    const student = await prisma.student.create({
      data: {
        registration: "1001",
        password: hashedPassword,
      },
    });

    res.status(200).json({
      message: "Test student created successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating student",
      error: error.message,
    });
  }
});

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