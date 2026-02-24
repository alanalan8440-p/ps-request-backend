const prisma = require("../../config/prisma");
const cloudinary = require("../../common/utils/cloudinary");
const AppError = require("../../common/errors/AppError");
const xlsx = require("xlsx");
const bcrypt = require("bcryptjs");

/* =========================================================
   GET PROFILE
========================================================= */
exports.getProfile = async (studentId) => {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      registration: true,
      name: true,
      department: true,
      year: true,
      section: true,
    },
  });

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  return student;
};

/* =========================================================
   SUBMIT OD / LEAVE REQUEST (Cloudinary Upload)
========================================================= */
exports.submitRequest = async (studentId, data, file) => {
  const { type, message } = data;

  if (!type || !message) {
    throw new AppError("Type and message are required", 400);
  }

  if (!["OD", "LEAVE"].includes(type)) {
    throw new AppError("Invalid request type", 400);
  }

  let proofUrl = null;

  if (file) {
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "ps-requests" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(file.buffer);
    });

    proofUrl = uploadResult.secure_url;
  }

  const request = await prisma.request.create({
    data: {
      type,
      message,
      proofUrl,   // ✅ matches schema
      status: "PENDING",
      studentId,
    },
  });

  return {
    status: "success",
    message: "Request submitted successfully",
    request,
  };
};

/* =========================================================
   GET MY REQUESTS
========================================================= */
exports.getMyRequests = async (studentId) => {
  return prisma.request.findMany({
    where: { studentId, isDeleted: false },
    orderBy: { createdAt: "desc" },
  });
};

/* =========================================================
   BULK UPLOAD STUDENTS (EXCEL)
========================================================= */
exports.bulkUploadStudents = async (filePath) => {
  if (!filePath) {
    throw new AppError("Excel file is required", 400);
  }

  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  if (!data.length) {
    throw new AppError("Excel file is empty", 400);
  }

  const studentsToInsert = [];

  for (const row of data) {
    if (!row.registration || !row.name) continue;

    const hashedPassword = await bcrypt.hash("Temp@123", 10);

    studentsToInsert.push({
      registration: String(row.registration),
      name: row.name,
      department: row.department || null,
      year: row.year || null,
      section: row.section || null,
      password: hashedPassword,
      firstLogin: true,
    });
  }

  await prisma.student.createMany({
    data: studentsToInsert,
    skipDuplicates: true,
  });

  return {
    status: "success",
    message: "Students uploaded successfully",
    totalInserted: studentsToInsert.length,
  };
};