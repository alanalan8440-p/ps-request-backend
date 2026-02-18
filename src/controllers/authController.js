const prisma = require("../config/prisma");
const jwt = require("../utils/jwt");
const hashUtil = require("../utils/hash");

/* =====================================================
   STUDENT LOGIN
===================================================== */
exports.studentLogin = async (req, res) => {
  try {
    const { registration, password } = req.body;

    if (!registration || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    let student = await prisma.student.findUnique({
      where: { registration }
    });

    // AUTO CREATE ON FIRST LOGIN
    if (!student) {

      if (password !== "DEV@123") {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      student = await prisma.student.create({
        data: {
          registration,
          password: await hashUtil.hashPassword("DEV@123"),
          firstLogin: true
        }
      });

      return res.json({ firstLogin: true });
    }

    const valid = await hashUtil.comparePassword(password, student.password);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (student.firstLogin) {
      return res.json({ firstLogin: true });
    }

    const token = jwt.generateToken({
      id: student.id,
      registration: student.registration
    });

    res.json({ token });

  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
};

/* =====================================================
   CHANGE PASSWORD
===================================================== */
exports.changeStudentPassword = async (req, res) => {
  try {
    const { registration, newPassword } = req.body;

    const student = await prisma.student.findUnique({
      where: { registration }
    });

    if (!student) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const hashed = await hashUtil.hashPassword(newPassword);

    await prisma.student.update({
      where: { registration },
      data: {
        password: hashed,
        firstLogin: false
      }
    });

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ message: "Password update error" });
  }
};