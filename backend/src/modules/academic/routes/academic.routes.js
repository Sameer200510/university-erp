const express = require("express");
const { verifyToken } = require("../../../middleware/auth.middleware");

const { authorizeRole } = require("../../../middleware/role.middleware");

const router = express.Router();

const academicController = require("../controllers/academic.controller");

router.get(
  "/subjects",
  verifyToken,
  authorizeRole("STUDENT"),
  academicController.getSubjects,
);

router.get(
  "/attendance",
  verifyToken,
  authorizeRole("STUDENT"),
  academicController.getAttendance,
);

router.get(
  "/marks",
  verifyToken,
  authorizeRole("STUDENT"),
  academicController.getMarks,
);

router.get(
  "/results",
  verifyToken,
  authorizeRole("STUDENT"),
  academicController.getResults,
);

router.get(
  "/attendance/:subjectId",
  verifyToken,
  authorizeRole("STUDENT"),
  academicController.getAttendanceDetails,
);

module.exports = router;
