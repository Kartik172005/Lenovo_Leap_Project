// Restrict route access to specific roles, e.g. authorizeRoles("admin", "ngo")
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Access denied for role: ${req.user ? req.user.role : "unknown"}`);
    }
    next();
  };
};

module.exports = authorizeRoles;
