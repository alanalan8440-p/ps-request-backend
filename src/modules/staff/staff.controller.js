const service = require("./staff.service");

/* ---------------- LOGIN ---------------- */
exports.login = async (req, res, next) => {
  try {
    const result = await service.login(req.body);
    res.json({ status: "success", data: result });
  } catch (err) {
    next(err);
  }
};

/* ---------------- GET ALL ---------------- */
exports.getAllRequests = async (req, res, next) => {
  try {
    const result = await service.getAllRequests();
    res.json({ status: "success", data: result });
  } catch (err) {
    next(err);
  }
};

/* ---------------- UPDATE STATUS ---------------- */
exports.updateRequestStatus = async (req, res, next) => {
  try {
    const result = await service.updateRequestStatus(
      req.params.id,
      req.body.status,
      req.user.id
    );

    res.json({ status: "success", data: result });
  } catch (err) {
    next(err);
  }
};

/* ---------------- SOFT DELETE ---------------- */
exports.softDeleteRequest = async (req, res, next) => {
  try {
    const result = await service.softDeleteRequest(req.params.id);
    res.json({ status: "success", data: result });
  } catch (err) {
    next(err);
  }
};

/* ---------------- HISTORY ---------------- */
exports.getRequestHistory = async (req, res, next) => {
  try {
    const result = await service.getRequestHistory(req.params.id);
    res.json({ status: "success", data: result });
  } catch (err) {
    next(err);
  }
};
