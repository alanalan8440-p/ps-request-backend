const authService = require("./auth.service");

/* ================= STUDENT LOGIN ================= */

exports.studentLogin = async (req, res, next) => {
  try {
    const result = await authService.studentLogin(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/* ================= STAFF LOGIN ================= */

exports.staffLogin = async (req, res, next) => {
  try {
    const result = await authService.staffLogin(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/* ================= CHANGE STUDENT PASSWORD ================= */

exports.changeStudentPassword = async (req, res, next) => {
  try {
    const result = await authService.changeStudentPassword(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/* ================= CHANGE STAFF PASSWORD ================= */

exports.changeStaffPassword = async (req, res, next) => {
  try {
    const result = await authService.changeStaffPassword(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};