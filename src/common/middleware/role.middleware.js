const AppError = require("../errors/AppError");

module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError("Access denied", 403));
    }
    next();
  };
};