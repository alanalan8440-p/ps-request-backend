const prisma = require("../config/prisma");

/* ---------------- GET PROFILE ---------------- */
const getProfile = async (req, res) => {
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

/* ---------------- MY REQUESTS ---------------- */
const myRequests = async (req, res) => {
  try {
    const requests = await prisma.request.findMany({
      where: { studentId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- SUBMIT REQUEST ---------------- */
const submitRequest = async (req, res) => {
  try {
    let { type, justification, fromDate, toDate } = req.body;

    if (!type || !justification || !fromDate || !toDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    type = type.toUpperCase();

    if (!["LEAVE", "OD"].includes(type)) {
      return res.status(400).json({ message: "Invalid request type" });
    }

    const request = await prisma.request.create({
      data: {
        studentId: req.user.id,
        type,
        justification,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
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

module.exports = {
  getProfile,
  myRequests,
  submitRequest,
};
