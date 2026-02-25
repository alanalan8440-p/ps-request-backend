const studentService = require("./student.service");
const AppError = require("../../common/errors/AppError");

/* =========================================================
   GET PROFILE
========================================================= */
exports.getProfile = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const student = await studentService.getProfile(studentId);

    res.status(200).json({
      status: "success",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   GET MY REQUESTS
========================================================= */
exports.myRequests = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const requests = await studentService.getMyRequests(studentId);

    res.status(200).json({
      status: "success",
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   SUBMIT REQUEST (IMAGE)
========================================================= */
exports.submitRequest = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const result = await studentService.submitRequest(
      studentId,
      req.body,
      req.file
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   BULK UPLOAD STUDENTS (EXCEL)
========================================================= */
exports.bulkUploadStudents = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError("Excel file is required", 400);
    }

    const result = await studentService.bulkUploadStudents(
      req.file.path
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};