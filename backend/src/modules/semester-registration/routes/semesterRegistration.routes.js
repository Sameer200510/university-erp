const express = require("express");

const { verifyToken } = require("../../../middleware/auth.middleware");

const { authorizeRole } = require("../../../middleware/role.middleware");

const semesterRegistrationController = require("../controllers/semesterRegistration.controller");

const router = express.Router();

router.get(
  "/my-registration",
  verifyToken,
  authorizeRole("STUDENT"),
  semesterRegistrationController.getMyRegistration,
);

router.post(
  "/register",
  verifyToken,
  authorizeRole("STUDENT"),
  semesterRegistrationController.registerSemester,
);

module.exports = router;
