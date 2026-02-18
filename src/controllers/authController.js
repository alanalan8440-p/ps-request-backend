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
      return res.status(400).json({
        message: "Registration and password required"
      });
    }

    const student = await prisma.student.findUnique({
      where: { registration }
    });

    // 🔥 FIRST LOGIN (DEV PASSWORD)
    if (!student) {
      if (password !== "DEV@123") {
        return res.status(401).json({
          message: "Use DEV@123 for first login"
        });
      }

      return res.status(200).json({
        firstLogin: true,
        message: "First login. Set your password."
      });
    }

    // NORMAL LOGIN
    const validPassword = await bcrypt.compare(
      password,
      student.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: student.id,
        role: "STUDENT"
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};


/* ============================================================
   SET PASSWORD (AUTO CREATE STUDENT IF NOT EXISTS)
============================================================ */
exports.setStudentPassword = async (req, res) => {
  try {
    const { registration, password } = req.body;

    if (!registration || !password) {
      return res.status(400).json({
        message: "Registration and password required"
      });
    }

    let student = await prisma.student.findUnique({
      where: { registration }
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 IF STUDENT DOES NOT EXIST → CREATE
    if (!student) {

      student = await prisma.student.create({
        data: {
          registration,
          name: "New Student",
          department: "Not Assigned",
          year: 1,
          section: "A",
          password: hashedPassword
        }
      });

    } else {
      // If exists → update password
      student = await prisma.student.update({
        where: { registration },
        data: { password: hashedPassword }
      });
    }

    const token = jwt.sign(
      {
        id: student.id,
        role: "STUDENT"
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Password set successfully",
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};