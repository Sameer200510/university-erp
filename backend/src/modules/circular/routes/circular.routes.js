const express = require("express");

const router = express.Router();

const controller = require("../controllers/circular.controller");

const { verifyToken } = require("../../../middleware/auth.middleware");

const { authorizeRole } = require("../../../middleware/role.middleware");

router.get("/", verifyToken, controller.getAllCirculars);

router.get("/:id", verifyToken, controller.getCircular);

router.post(
  "/",
  verifyToken,
  authorizeRole("SUPER_ADMIN"),
  controller.createCircular,
);

module.exports = router;
