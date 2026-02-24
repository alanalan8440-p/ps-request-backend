const prisma = require("./src/config/prisma");
const bcrypt = require("bcryptjs");

async function fixPasswords() {
  const students = await prisma.student.findMany();

  for (let student of students) {
    if (!student.password.startsWith("$2b$")) {
      const hashed = await bcrypt.hash(student.password, 10);

      await prisma.student.update({
        where: { id: student.id },
        data: { password: hashed },
      });

      console.log("Updated:", student.registration);
    }
  }

  console.log("Done");
  process.exit();
}

fixPasswords();