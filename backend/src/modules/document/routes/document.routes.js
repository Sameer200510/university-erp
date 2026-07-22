const express = require("express");
const router = express.Router();

const documentController = require("../controllers/document.controller");

const { verifyToken } = require("../../../middleware/auth.middleware");
const { authorizeRole } = require("../../../middleware/role.middleware");

const uploadDocument = require("../../../middleware/uploadDocument.middleware");

router.use(verifyToken);

router.get(
  "/my-documents",
  authorizeRole("STUDENT"),
  documentController.getMyDocuments,
);

router.post(
  "/upload",
  authorizeRole("STUDENT"),
  uploadDocument.single("file"),
  documentController.uploadDocument,
);

router.delete(
  "/:id",
  authorizeRole("STUDENT"),
  documentController.deleteDocument,
);

module.exports = router;
