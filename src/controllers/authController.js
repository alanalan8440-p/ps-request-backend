const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/*
|--------------------------------------------------------------------------
| STUDENT LOGIN
|--------------------------------------------------------------------------
*/
exports.loginStudent = async (req, res) => {
  try {
    const { registration, password } = req.body;

    if (!registration || !password) {
      return res.status(400).json({ message: "Registration and password required" });
    }

    const student = await prisma.student.findUnique({
      where: { registration }
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 🔥 FIRST LOGIN (NO PASSWORD SET)
    if (!student.password) {

      if (password !== "DEV@123") {
        return res.status(401).json({ message: "Use developer password for first login" });
      }

      return res.json({
        message: "First login detected",
        firstLogin: true
      });
    }

    // 🔐 NORMAL LOGIN
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

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/*
|--------------------------------------------------------------------------
| CHANGE PASSWORD (FIRST LOGIN)
|--------------------------------------------------------------------------
*/
exports.changePassword = async (req, res) => {
  try {
    const { registration, newPassword } = req.body;

    if (!registration || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const student = await prisma.student.findUnique({
      where: { registration }
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.student.update({
      where: { registration },
      data: {
        password: hashedPassword
      }
    });

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};