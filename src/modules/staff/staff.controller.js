const staffService = require("./staff.service");

/* =========================================================
   LOGIN
========================================================= */
exports.login = async (req, res, next) => {
  try {
    const result = await staffService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   CHANGE PASSWORD
========================================================= */
exports.changePassword = async (req, res, next) => {
  try {
    const { staffId, newPassword } = req.body;

    const result = await staffService.changePassword(
      staffId,
      newPassword
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   GET ALL REQUESTS
========================================================= */
exports.getAllRequests = async (req, res, next) => {
  try {
    const result = await staffService.getAllRequests();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   UPDATE REQUEST STATUS
========================================================= */
exports.updateRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const staffId = req.user.id; // from auth middleware

    const result = await staffService.updateRequestStatus(
      id,
      status,
      staffId
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   SOFT DELETE REQUEST
========================================================= */
exports.softDeleteRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await staffService.softDeleteRequest(id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   GET REQUEST HISTORY
========================================================= */
exports.getRequestHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await staffService.getRequestHistory(id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};