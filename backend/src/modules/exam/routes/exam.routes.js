const express = require("express");

const { verifyToken } = require("../../../middleware/auth.middleware");

const { authorizeRole } = require("../../../middleware/role.middleware");

const examController = require("../controllers/exam.controller");

const router = express.Router();

router.get(
  "/dashboard",
  verifyToken,
  authorizeRole("STUDENT"),
  examController.getDashboard,
);

router.get(
  "/back-papers",
  verifyToken,
  authorizeRole("STUDENT"),
  examController.getBackPapers,
);

router.post(
  "/back-papers",
  verifyToken,
  authorizeRole("STUDENT"),
  examController.applyBackPaper,
);

router.get(
  "/results",
  verifyToken,
  authorizeRole("STUDENT"),
  examController.getResults,
);

router.get(
  "/marks",
  verifyToken,
  authorizeRole("STUDENT"),
  examController.getMarks,
);

router.get(
  "/marksheets",
  verifyToken,
  authorizeRole("STUDENT"),
  examController.getMarksheets,
);

router.get(
  "/marksheets/:semester/download",
  verifyToken,
  authorizeRole("STUDENT"),
  examController.downloadMarksheet,
);

module.exports = router;
