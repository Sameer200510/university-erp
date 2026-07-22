const express = require("express");

const { verifyToken } = require("../../../middleware/auth.middleware");

const { authorizeRole } = require("../../../middleware/role.middleware");

const feesController = require("../controllers/fees.controller");

const router = express.Router();

router.get(
  "/dashboard",
  verifyToken,
  authorizeRole("STUDENT"),
  feesController.getDashboard,
);

router.get(
  "/installments",
  verifyToken,
  authorizeRole("STUDENT"),
  feesController.getInstallments,
);

router.get(
  "/payments",
  verifyToken,
  authorizeRole("STUDENT"),
  feesController.getPayments,
);

router.get(
  "/receipts",
  verifyToken,
  authorizeRole("STUDENT"),
  feesController.getReceipts,
);

router.get(
  "/receipt/:receiptId",
  verifyToken,
  authorizeRole("STUDENT"),
  feesController.downloadReceipt,
);

module.exports = router;
