const service = require("./student.service");

/* =========================================================
   GET PROFILE
========================================================= */
exports.getProfile = async (req, res, next) => {
  try {
    const result = await service.getProfile(req.user.id);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================================================
   GET MY REQUESTS
========================================================= */
exports.myRequests = async (req, res, next) => {
  try {
    const result = await service.getMyRequests(req.user.id);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================================================
   SUBMIT OD / LEAVE REQUEST (Cloudinary)
========================================================= */
exports.submitRequest = async (req, res, next) => {
  try {
    const { type, message } = req.body;

    if (!type || !message) {
      return res.status(400).json({
        status: "error",
        message: "Type and message are required",
      });
    }

    if (!["OD", "LEAVE"].includes(type)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid request type",
      });
    }

    const result = await service.submitRequest(
      req.user.id,
      { type, message },
      req.file // send entire file object
    );

    res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================================================
   BULK UPLOAD STUDENTS (STAFF ONLY)
========================================================= */
exports.bulkUploadStudents = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "Excel file is required",
      });
    }

    const result = await service.bulkUploadStudents(
      req.file.path
    );

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};