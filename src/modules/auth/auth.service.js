const prisma = require("../../config/prisma");
const AppError = require("../../common/errors/AppError");
const { comparePassword, hashPassword } = require("../../common/utils/hash");
const { generateToken } = require("../../common/utils/jwt");

exports.studentLogin = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("Email and password required", 400);
  }

  const student = await prisma.student.findUnique({
    where: { email }
  });

  if (!student) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await comparePassword(password, student.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken({
    id: student.id,
    role: "student"
  });

  return {
    token,
    student: {
      id: student.id,
      name: student.name,
      email: student.email
    }
  };
};

exports.changeStudentPassword = async (userId, { oldPassword, newPassword }) => {
  const student = await prisma.student.findUnique({
    where: { id: userId }
  });

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  const isMatch = await comparePassword(oldPassword, student.password);

  if (!isMatch) {
    throw new AppError("Old password incorrect", 401);
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.student.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });

  return { message: "Password updated successfully" };
};

