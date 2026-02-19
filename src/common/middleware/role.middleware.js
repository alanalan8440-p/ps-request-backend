const AppError = require("../errors/AppError");

module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }

    next();
  };
};
