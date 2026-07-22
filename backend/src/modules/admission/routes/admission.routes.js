const express = require("express");
const router = express.Router();
const admissionController = require("../controllers/admission.controller");
const { verifyToken } = require("../../../middleware/auth.middleware");
const { authorizeRole } = require("../../../middleware/role.middleware");

router.use(verifyToken);

router.get(
  "/status",
  authorizeRole(["STUDENT"]),
  admissionController.getStatus,
);
router.post("/apply", authorizeRole(["STUDENT"]), admissionController.apply);

module.exports = router;
