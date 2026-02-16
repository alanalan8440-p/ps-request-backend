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
      where: { studentId: req.user.id },
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
    const { type, justification, fromDate, toDate } = req.body;

    if (!type || !justification || !fromDate || !toDate) {
      return res.status(400).json({
        message: "All fields are required",
      });
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
