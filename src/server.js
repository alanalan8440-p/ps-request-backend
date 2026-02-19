const app = require("./app");
const prisma = require("./config/prisma");
const { PORT } = require("./config/env");

async function start() {
  try {
    await prisma.$connect();
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Database connection failed", err);
    process.exit(1);
  }
}

start();

