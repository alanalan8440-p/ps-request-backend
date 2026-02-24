const prisma = require("../../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ================= TOKEN GENERATOR ================= */

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

/* ================= STUDENT LOGIN ================= */

exports.studentLogin = async ({ registration, password }) => {
  if (!registration || !password) {
    throw new Error("Registration and password are required");
  }

  const student = await prisma.student.findUnique({
    where: { registration },
  });

  if (!student) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(student.id, "student");

  return {
    token,
    role: "student",
    student: {
      registration: student.registration,
      name: student.name,
      department: student.department,
      year: student.year,
      section: student.section,
    },
  };
};

/* ================= STAFF LOGIN ================= */

exports.staffLogin = async ({ staffId, password }) => {
  if (!staffId || !password) {
    throw new Error("Staff ID and password are required");
  }

  const staff = await prisma.staff.findUnique({
    where: { staffId },
  });

  if (!staff) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, staff.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(staff.id, "staff");

  return {
    token,
    role: "staff",
    staff: {
      staffId: staff.staffId,
      name: staff.name,
    },
  };
};

/* ================= CHANGE STUDENT PASSWORD ================= */

exports.changeStudentPassword = async ({ registration, newPassword }) => {
  if (!registration || !newPassword) {
    throw new Error("Registration and new password are required");
  }

  const student = await prisma.student.findUnique({
    where: { registration },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.student.update({
    where: { registration },
    data: {
      password: hashedPassword,
      firstLogin: false,
    },
  });

  return { message: "Password changed successfully" };
};

/* ================= CHANGE STAFF PASSWORD ================= */

exports.changeStaffPassword = async ({ staffId, newPassword }) => {
  if (!staffId || !newPassword) {
    throw new Error("Staff ID and new password are required");
  }

  const staff = await prisma.staff.findUnique({
    where: { staffId },
  });

  if (!staff) {
    throw new Error("Staff not found");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.staff.update({
    where: { staffId },
    data: {
      password: hashedPassword,
      firstLogin: false,
    },
  });

  return { message: "Password changed successfully" };
};