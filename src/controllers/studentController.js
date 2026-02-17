const prisma = require("../config/prisma");

/*
|--------------------------------------------------------------------------
| GET STUDENT PROFILE
|--------------------------------------------------------------------------
*/
exports.getProfile = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        registration: true,
        name: true,
        department: true,
        year: true,
        section: true,
        createdAt: true,
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/*
|--------------------------------------------------------------------------
| GET MY REQUESTS
|--------------------------------------------------------------------------
*/
exports.myRequests = async (req, res) => {
  try {
    const requests = await prisma.request.findMany({
      where: { 
        studentId: req.user.id,
        deletedAt: null 
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/*
|--------------------------------------------------------------------------
| SUBMIT REQUEST
|--------------------------------------------------------------------------
*/
exports.submitRequest = async (req, res) => {
  try {
    let { type, justification, fromDate, toDate } = req.body;

    // 1️⃣ Required fields validation
    if (!type || !justification || !fromDate || !toDate) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 2️⃣ Normalize & validate type
    type = type.toUpperCase();

    if (!["LEAVE", "OD"].includes(type)) {
      return res.status(400).json({ message: "Invalid request type" });
    }

    // 3️⃣ Trim justification
    justification = justification.trim();

    if (justification.length < 10) {
      return res.status(400).json({
        message: "Justification must be at least 10 characters",
      });
    }

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    // Normalize time to midnight (avoid timezone issues)
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 4️⃣ No past dates
    if (startDate < today) {
      return res.status(400).json({
        message: "Cannot request leave for past dates",
      });
    }

    // 5️⃣ fromDate must be <= toDate
    if (startDate > endDate) {
      return res.status(400).json({
        message: "From date cannot be after To date",
      });
    }

    // 6️⃣ Max leave duration (10 days inclusive)
    const diffTime = endDate - startDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;

    if (diffDays > 10) {
      return res.status(400).json({
        message: "Maximum 10 days leave allowed",
      });
    }

    // 7️⃣ Overlapping request check
    const overlapping = await prisma.request.findFirst({
      where: {
        studentId: req.user.id,
        status: { not: "REJECTED" },
        deletedAt: null,
        OR: [
          {
            fromDate: { lte: endDate },
            toDate: { gte: startDate },
          },
        ],
      },
    });

    if (overlapping) {
      return res.status(400).json({
        message: "You already have a leave request for these dates",
      });
    }

    // 8️⃣ Create request
    const request = await prisma.request.create({
      data: {
        studentId: req.user.id,
        type,
        justification,
        fromDate: startDate,
        toDate: endDate,
        status: "PENDING",
      },
    });

    res.status(201).json({
      message: "Request submitted successfully",
      request,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error submitting request" });
  }
};
