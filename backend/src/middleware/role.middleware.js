const authorizeRole = (...roles) => {
  return (req, res, next) => {
    console.log("REQ USER =", req.user);
    console.log("ALLOWED ROLES =", roles);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };
};

module.exports = {
  authorizeRole,
};
