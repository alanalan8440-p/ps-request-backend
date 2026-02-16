module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    // Ensure user exists (authMiddleware must run before this)
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized: User not authenticated",
      });
    }

    // Check role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: Insufficient permissions",
      });
    }

    next();
  };
};

