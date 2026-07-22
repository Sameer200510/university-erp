const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");
const { verifyToken } = require("../../../middleware/auth.middleware");
const { authorizeRole } = require("../../../middleware/role.middleware");

router.use(verifyToken, authorizeRole("STUDENT", "SUPER_ADMIN"));

router.get("/profile", studentController.getProfile);
router.post("/profile", studentController.updateProfile);

module.exports = router;
