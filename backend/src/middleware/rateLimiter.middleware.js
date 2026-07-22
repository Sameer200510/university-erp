const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 0.3 * 60 * 1000,
  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
});

module.exports = {
  loginLimiter,
};
