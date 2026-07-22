const express = require("express");
const { verifyToken } = require("../../../middleware/auth.middleware");
const { authorizeRole } = require("../../../middleware/role.middleware");
const feesController = require("../controllers/fees.controller");

const router = express.Router();

// ================= ADMIN / CASHIER / ACCOUNTS ROUTES =================
router.get(
  "/admin/dashboard",
  verifyToken,
  authorizeRole("SUPER_ADMIN", "ADMISSION_OFFICER", "FINANCE_OFFICER"),
  feesController.getAdminDashboard,
);

router.get(
  "/admin/heads",
  verifyToken,
  authorizeRole("SUPER_ADMIN", "ADMISSION_OFFICER", "FINANCE_OFFICER"),
  feesController.getFeeHeads,
);

router.post(
  "/admin/heads",
  verifyToken,
  authorizeRole("SUPER_ADMIN", "FINANCE_OFFICER"),
  feesController.createFeeHead,
);

router.get(
  "/admin/matrix",
  verifyToken,
  authorizeRole("SUPER_ADMIN", "ADMISSION_OFFICER", "FINANCE_OFFICER"),
  feesController.getFeeMatrix,
);

router.post(
  "/admin/matrix",
  verifyToken,
  authorizeRole("SUPER_ADMIN", "FINANCE_OFFICER"),
  feesController.saveFeeMatrixRule,
);

router.post(
  "/admin/invoice/generate",
  verifyToken,
  authorizeRole("SUPER_ADMIN", "FINANCE_OFFICER"),
  feesController.generateSemesterInvoices,
);

router.post(
  "/admin/collect-offline",
  verifyToken,
  authorizeRole("SUPER_ADMIN", "FINANCE_OFFICER"),
  feesController.collectOfflinePayment,
);

router.post(
  "/admin/transaction/:id/bounce",
  verifyToken,
  authorizeRole("SUPER_ADMIN", "FINANCE_OFFICER"),
  feesController.markChequeBounce,
);

router.post(
  "/admin/dunning/apply-late-fees",
  verifyToken,
  authorizeRole("SUPER_ADMIN", "FINANCE_OFFICER"),
  feesController.applyLateFees,
);

router.post(
  "/admin/dunning/send-reminders",
  verifyToken,
  authorizeRole("SUPER_ADMIN", "FINANCE_OFFICER"),
  feesController.sendReminders,
);

// ================= STUDENT PORTAL ROUTES =================
router.get(
  "/dashboard",
  verifyToken,
  authorizeRole("STUDENT"),
  feesController.getDashboard,
);

router.get(
  "/ledger",
  verifyToken,
  authorizeRole("STUDENT"),
  feesController.getStudentLedger,
);

router.get(
  "/invoices",
  verifyToken,
  authorizeRole("STUDENT"),
  feesController.getStudentInvoices,
);

router.post(
  "/pay-online",
  verifyToken,
  authorizeRole("STUDENT"),
  feesController.payOnline,
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
  authorizeRole("STUDENT", "SUPER_ADMIN", "ADMISSION_OFFICER", "FINANCE_OFFICER"),
  feesController.downloadReceipt,
);

module.exports = router;
