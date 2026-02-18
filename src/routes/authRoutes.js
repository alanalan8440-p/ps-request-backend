const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* ============================================================
   STUDENT LOGIN
============================================================ */
exports.loginStudent = async (req, res) => {
  try {
    const { registration, password } = req.body;

    if (!registration || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    let student = await prisma.student.findUnique({
      where: { registration }
    });

    /* --------------------------------------------------------
       FIRST LOGIN (AUTO CREATE)
    --------------------------------------------------------- */
    if (!student && password === "DEV@123") {
      student = await prisma.student.create({
        data: {
          registration,
          name: "New Student",
          department: "Not Assigned",
          year: 1,
          section: "A",
          password: ""
        }
      });

      return res.json({
        firstLogin: true,
        registration
      });
    }

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    /* --------------------------------------------------------
       PASSWORD NOT SET YET
    --------------------------------------------------------- */
    if (!student.password || student.password === "") {
      if (password === "DEV@123") {
        return res.json({
          firstLogin: true,
          registration
        });
      }
    }

    /* --------------------------------------------------------
       NORMAL LOGIN
    --------------------------------------------------------- */
    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: student.id,
        role: "STUDENT"
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/* ============================================================
   CHANGE PASSWORD
============================================================ */
exports.changeStudentPassword = async (req, res) => {
  try {
    const { registration, newPassword } = req.body;

    if (!registration || !newPassword) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const student = await prisma.student.findUnique({
      where: { registration }
    });

    if (!student) {
      return res.status(404).json({ message: "Registration not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.student.update({
      where: { registration },
      data: { password: hashedPassword }
    });

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};