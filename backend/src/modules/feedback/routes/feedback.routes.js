const express = require("express");

const { verifyToken } = require("../../../middleware/auth.middleware");

const { authorizeRole } = require("../../../middleware/role.middleware");

const feedbackController = require("../controllers/feedback.controller");

const router = express.Router();

router.get(
  "/faculties",
  verifyToken,
  authorizeRole("STUDENT"),
  feedbackController.getFaculties,
);

router.post(
  "/submit",
  verifyToken,
  authorizeRole("STUDENT"),
  feedbackController.submitFeedback,
);

router.get(
  "/my-feedback",
  verifyToken,
  authorizeRole("STUDENT"),
  feedbackController.getMyFeedback,
);

module.exports = router;
