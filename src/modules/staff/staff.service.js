const prisma = require("../../config/prisma");
const AppError = require("../../common/errors/AppError");
const { comparePassword, hashPassword } = require("../../common/utils/hash");
const { generateToken } = require("../../common/utils/jwt");

/* =========================================================
   STAFF LOGIN
========================================================= */
exports.login = async ({ staffId, password }) => {
  if (!staffId || !password) {
    throw new AppError("staffId and password required", 400);
  }

  const staff = await prisma.staff.findUnique({
    where: { staffId }
  });

  if (!staff) {
    throw new AppError("Invalid credentials", 401);
  }

  const valid = await comparePassword(password, staff.password);

  if (!valid) {
    throw new AppError("Invalid credentials", 401);
  }

  // 🔥 FORCE PASSWORD RESET ON FIRST LOGIN
  if (staff.firstLogin) {
    return {
      requirePasswordChange: true,
      staffId: staff.staffId,
      name: staff.name
    };
  }

  return {
    token: generateToken({
      id: staff.id,
      role: "staff"
    })
  };
};

/* =========================================================
   CHANGE PASSWORD (FIRST LOGIN OR NORMAL)
========================================================= */
exports.changePassword = async (staffId, newPassword) => {
  if (!staffId || !newPassword) {
    throw new AppError("staffId and newPassword required", 400);
  }

  const staff = await prisma.staff.findUnique({
    where: { staffId }
  });

  if (!staff) {
    throw new AppError("Staff not found", 404);
  }

  const hashed = await hashPassword(newPassword);

  await prisma.staff.update({
    where: { staffId },
    data: {
      password: hashed,
      firstLogin: false
    }
  });

  return { message: "Password updated successfully" };
};

/* =========================================================
   GET ALL REQUESTS
========================================================= */
exports.getAllRequests = async () => {
  return prisma.request.findMany({
    where: { isDeleted: false },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          registration: true,
          department: true,
          year: true,
          section: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

/* =========================================================
   UPDATE REQUEST STATUS
========================================================= */
exports.updateRequestStatus = async (requestId, status, staffId) => {
  const validStatuses = ["APPROVED", "REJECTED"];

  if (!validStatuses.includes(status)) {
    throw new AppError("Invalid status value", 400);
  }

  const request = await prisma.request.findUnique({
    where: { id: parseInt(requestId) }
  });

  if (!request || request.isDeleted) {
    throw new AppError("Request not found", 404);
  }

  if (request.status !== "PENDING") {
    throw new AppError("Only pending requests can be updated", 400);
  }

  return prisma.request.update({
    where: { id: parseInt(requestId) },
    data: {
      status,
      processedBy: staffId,
      processedAt: new Date()
    }
  });
};

/* =========================================================
   SOFT DELETE REQUEST
========================================================= */
exports.softDeleteRequest = async (requestId) => {
  const request = await prisma.request.findUnique({
    where: { id: parseInt(requestId) }
  });

  if (!request) {
    throw new AppError("Request not found", 404);
  }

  return prisma.request.update({
    where: { id: parseInt(requestId) },
    data: { isDeleted: true }
  });
};

/* =========================================================
   GET REQUEST HISTORY
========================================================= */
exports.getRequestHistory = async (requestId) => {
  const request = await prisma.request.findUnique({
    where: { id: parseInt(requestId) },
    include: {
      student: {
        select: {
          name: true,
          registration: true,
          department: true,
          year: true,
          section: true
        }
      }
    }
  });

  if (!request) {
    throw new AppError("Request not found", 404);
  }

  return request;
};