const service = require("./student.service");

exports.getProfile = async (req, res, next) => {
  try {
    const result = await service.getProfile(req.user.id);
    res.json({ status: "success", data: result });
  } catch (err) {
    next(err);
  }
};

exports.myRequests = async (req, res, next) => {
  try {
    const result = await service.getMyRequests(req.user.id);
    res.json({ status: "success", data: result });
  } catch (err) {
    next(err);
  }
};

exports.submitRequest = async (req, res, next) => {
  try {
    const result = await service.submitRequest(req.user.id, req.body);
    res.status(201).json({ status: "success", data: result });
  } catch (err) {
    next(err);
  }
};
