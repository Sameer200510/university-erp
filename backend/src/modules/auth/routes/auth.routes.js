const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../../../middleware/auth.middleware");
const { authorizeRole } = require("../../../middleware/role.middleware");
const validate = require("../../../middleware/validation.middleware");
const { loginLimiter } = require("../../../middleware/rateLimiter.middleware");

router.post(
  "/login",
  loginLimiter,
  body("userId").trim().notEmpty().withMessage("User ID is required"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
  authController.login,
);

router.post(
  "/change-password",
  verifyToken,
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("New password must contain uppercase, lowercase and a number"),
  validate,
  authController.changePassword,
);

router.get("/me", verifyToken, authController.getMe);

// Protected dev/admin seed endpoint
router.post(
  "/seed",
  verifyToken,
  authorizeRole("SUPER_ADMIN"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").notEmpty().withMessage("Role is required"),
  validate,
  authController.seed,
);

module.exports = router;
