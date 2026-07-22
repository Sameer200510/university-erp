const express = require("express");

const router = express.Router();

const controller = require("../controllers/revaluation.controller");

const { verifyToken } = require("../../../middleware/auth.middleware");

const { authorizeRole } = require("../../../middleware/role.middleware");

router.get(
  "/subjects",
  verifyToken,
  authorizeRole("STUDENT"),
  controller.getSubjects,
);

router.get(
  "/applications",
  verifyToken,
  authorizeRole("STUDENT"),
  controller.getApplications,
);

router.post("/apply", verifyToken, authorizeRole("STUDENT"), controller.apply);

module.exports = router;
