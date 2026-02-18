const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/*
|--------------------------------------------------------------------------
| STUDENT LOGIN (AUTO CREATE ON FIRST LOGIN)
|--------------------------------------------------------------------------
*/
exports.loginStudent = async (req, res) => {
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

    /*
    |--------------------------------------------------------------------------
    | FIRST TIME LOGIN
    |--------------------------------------------------------------------------
    */
    if (!student) {

      if (password !== "DEV@123") {
        return res.status(404).json({
          message: "Student not found"
        });
      }

      // Create student with temporary password
      const hashedPassword = await bcrypt.hash(password, 10);

      student = await prisma.student.create({
        data: {
          registration,
          name: "New Student",
          department: "Not Set",
          year: 1,
          section: "A",
          password: hashedPassword
        }
      });

      return res.status(201).json({
        firstLogin: true,
        message: "First login successful. Please change password."
      });
    }

    /*
    |--------------------------------------------------------------------------
    | NORMAL LOGIN
    |--------------------------------------------------------------------------
    */
    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
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
    res.status(500).json({ message: "Server error" });
  }
};


/*
|--------------------------------------------------------------------------
| CHANGE PASSWORD
|--------------------------------------------------------------------------
*/
exports.changePassword = async (req, res) => {
  try {
    const { registration, newPassword } = req.body;

    if (!registration || !newPassword) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters"
      });
    }

    const student = await prisma.student.findUnique({
      where: { registration }
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.student.update({
      where: { registration },
      data: { password: hashedPassword }
    });

    res.json({
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};