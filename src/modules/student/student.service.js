const prisma = require("../../config/prisma");
const AppError = require("../../common/errors/AppError");

/* =========================================================
   GET STUDENT PROFILE
========================================================= */
exports.getProfile = async (userId) => {
  const student = await prisma.student.findUnique({
    where: { id: userId },
    select: {
      id: true,
      registration: true,
      name: true,
      email: true,
      department: true,
      year: true,
      section: true,
      createdAt: true
    }
  });

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  return student;
};

/* =========================================================
   GET STUDENT REQUESTS
========================================================= */
exports.getMyRequests = async (userId) => {
  return prisma.request.findMany({
    where: {
      studentId: userId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

/* =========================================================
   SUBMIT NEW REQUEST
========================================================= */
exports.submitRequest = async (userId, data) => {
  const { type, justification, fromDate, toDate } = data;

  if (!type || !justification || !fromDate || !toDate) {
    throw new AppError("All fields are required", 400);
  }

  const normalizedType = type.toUpperCase();

  if (!["LEAVE", "OD"].includes(normalizedType)) {
    throw new AppError("Invalid request type", 400);
  }

  const parsedFromDate = new Date(fromDate);
  const parsedToDate = new Date(toDate);

  if (isNaN(parsedFromDate) || isNaN(parsedToDate)) {
    throw new AppError("Invalid date format", 400);
  }

  if (parsedToDate < parsedFromDate) {
    throw new AppError("To date cannot be earlier than from date", 400);
  }

  const request = await prisma.request.create({
    data: {
      studentId: userId,
      type: normalizedType,
      justification,
      fromDate: parsedFromDate,
      toDate: parsedToDate,
      status: "PENDING"
    }
  });

  return request;
};
