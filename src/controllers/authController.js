const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

// ======================
// STUDENT LOGIN
// ======================

exports.studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const student = await prisma.student.findUnique({
      where: { email }
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: student.id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      student: {
        id: student.id,
        name: student.name,
        email: student.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

// ======================
// CHANGE PASSWORD
// ======================

exports.changeStudentPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const student = await prisma.student.findUnique({
      where: { id: req.user.id }
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, student.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Old password incorrect"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.student.update({
      where: { id: student.id },
      data: { password: hashedPassword }
    });

    res.status(200).json({
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};
