const express = require("express");

const router = express.Router();

const controller = require("../controllers/admitCard.controller");

const { verifyToken } = require("../../../middleware/auth.middleware");

const { authorizeRole } = require("../../../middleware/role.middleware");

router.get(
  "/eligibility",
  verifyToken,
  authorizeRole("STUDENT"),
  controller.getEligibility,
);

router.post(
  "/generate",
  verifyToken,
  authorizeRole("STUDENT"),
  controller.generateAdmitCard,
);

module.exports = router;
