const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../../../middleware/auth.middleware");
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

router.post("/change-password", verifyToken, authController.changePassword);

router.get("/me", verifyToken, authController.getMe);

router.post("/seed", authController.seed);

module.exports = router;
