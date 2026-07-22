const express = require("express");

const router = express.Router();

const storageController = require("../controllers/storage.controller");

const upload = require("../../../middleware/upload.middleware");

const { verifyToken } = require("../../../middleware/auth.middleware");

router.post(
  "/profile-photo",
  verifyToken,
  upload.single("photo"),
  storageController.uploadProfilePhoto,
);

module.exports = router;
