const prisma = require("../../../config/prisma");
const feesRepository = require("../repositories/fees.repository");
const receiptPdfService = require("./receiptPdf.service");
const AppError = require("../../../utils/AppError");

class FeesService {
  /**
   * Get Student Dashboard Fee Summary (Supports both new FeeInvoice and fallback FeeStructure)
   */
  async getDashboard(userId) {
    // Look up student profile by userId
    const student = await prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (student) {
      const invoices = await prisma.feeInvoice.findMany({
        where: { studentId: student.id },
        include: { items: { include: { feeHead: true } } },
        orderBy: { semester: "asc" },
      });

      if (invoices.length > 0) {
        const totalFee = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
        const scholarship = invoices.reduce((sum, i) => sum + i.discountAmount, 0);
        const netFee = invoices.reduce((sum, i) => sum + i.netAmount, 0);
        const paidAmount = invoices.reduce((sum, i) => sum + i.paidAmount, 0);
        const pendingAmount = netFee - paidAmount;

        const currentDueInvoice = invoices.find((i) => i.status !== "PAID") || null;
        const progress = netFee > 0 ? Number(((paidAmount / netFee) * 100).toFixed(2)) : 0;

        return {
          totalFee,
          scholarship,
          netFee,
          paidAmount,
          pendingAmount,
          progress,
          currentDue: currentDueInvoice
            ? {
                id: currentDueInvoice.id,
                invoiceNo: currentDueInvoice.invoiceNo,
                semester: currentDueInvoice.semester,
                amount: currentDueInvoice.netAmount - currentDueInvoice.paidAmount,
                dueDate: currentDueInvoice.dueDate,
                status: currentDueInvoice.status,
              }
            : null,
          invoices,
        };
      }
    }

    // Fallback to old feeStructure if no student/invoices found
    const feeStructure = await feesRepository.getFeeStructure(userId);
    if (!feeStructure) {
      return {
        totalFee: 0,
        scholarship: 0,
        netFee: 0,
        paidAmount: 0,
        pendingAmount: 0,
        progress: 0,
        currentDue: null,
        invoices: [],
      };
    }

    const installments = await feesRepository.getInstallments(userId);
    const paidAmount = installments
      .filter((i) => i.status === "PAID")
      .reduce((sum, i) => sum + i.amount, 0);
    const pendingAmount = feeStructure.netFee - paidAmount;
    const currentDue = installments.find((i) => i.status === "PENDING") || null;
    const progress = feeStructure.netFee > 0 ? Number(((paidAmount / feeStructure.netFee) * 100).toFixed(2)) : 0;

    return {
      totalFee: feeStructure.totalFee,
      scholarship: feeStructure.scholarship,
      netFee: feeStructure.netFee,
      paidAmount,
      pendingAmount,
      progress,
      currentDue,
    };
  }

  /**
   * Get Student Ledger Statement
   */
  async getStudentLedger(userId) {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) return [];

    return await prisma.studentLedger.findMany({
      where: { studentId: student.id },
      orderBy: { transactionDate: "desc" },
    });
  }

  /**
   * Get Student Invoices with detailed items
   */
  async getStudentInvoices(userId) {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) return [];

    return await prisma.feeInvoice.findMany({
      where: { studentId: student.id },
      include: {
        items: { include: { feeHead: true } },
        transactions: true,
      },
      orderBy: { semester: "asc" },
    });
  }

  /**
   * Simulate Student Online Payment Checkout (Razorpay / Stripe / UPI)
   */
  async payOnline({ userId, invoiceId, amount, paymentMode, gatewayTxnId }) {
    return await prisma.$transaction(async (tx) => {
      const student = await tx.studentProfile.findUnique({ where: { userId } });
      if (!student) throw new AppError("Student profile not found", 404);

      const invoice = await tx.feeInvoice.findUnique({ where: { id: invoiceId } });
      if (!invoice) throw new AppError("Invoice not found", 404);
      if (invoice.status === "PAID") throw new AppError("Invoice is already fully paid", 400);

      const payAmount = Number(amount);
      if (isNaN(payAmount) || payAmount <= 0) {
        throw new AppError("Invalid payment amount", 400);
      }

      const timestamp = Date.now();
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const transactionNo = `TXN-${new Date().getFullYear()}-${timestamp}-${randomSuffix}`;
      const receiptNumber = `REC-${new Date().getFullYear()}-${timestamp}-${randomSuffix}`;

      const transaction = await tx.feeTransaction.create({
        data: {
          transactionNo,
          invoiceId,
          studentId: student.id,
          amount: payAmount,
          paymentMode: paymentMode || "ONLINE_RAZORPAY",
          gatewayTxnId: gatewayTxnId || `PAY_${timestamp}_${randomSuffix}`,
          status: "SUCCESS",
          collectedBy: "ONLINE",
          receiptNumber,
        },
      });

      const newPaidAmount = invoice.paidAmount + payAmount;
      const newStatus = newPaidAmount >= invoice.netAmount ? "PAID" : "PARTIAL";
      await tx.feeInvoice.update({
        where: { id: invoiceId },
        data: {
          paidAmount: newPaidAmount,
          status: newStatus,
        },
      });

      await tx.studentLedger.create({
        data: {
          studentId: student.id,
          type: "CREDIT",
          amount: payAmount,
          referenceId: transaction.id,
          referenceType: "PAYMENT",
          description: `Online Payment (${paymentMode}) - Receipt: ${receiptNumber}`,
          balanceAfter: invoice.netAmount - newPaidAmount,
        },
      });

      await tx.generalLedger.create({
        data: {
          accountHead: "BANK_ACCOUNT",
          debit: payAmount,
          credit: 0,
          referenceId: transaction.id,
          description: `Online fee collection (${paymentMode}) from ${student.firstName} ${student.lastName}`,
        },
      });

      await tx.generalLedger.create({
        data: {
          accountHead: "ACCOUNTS_RECEIVABLE",
          debit: 0,
          credit: payAmount,
          referenceId: transaction.id,
          description: `Receivable cleared for Invoice ${invoice.invoiceNo}`,
        },
      });

      return {
        success: true,
        transaction,
        receiptNumber,
      };
    });
  }

  async getInstallments(userId) {
    return await feesRepository.getInstallments(userId);
  }

  async getPayments(userId) {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (student) {
      const txns = await prisma.feeTransaction.findMany({
        where: { studentId: student.id },
        include: { invoice: true },
        orderBy: { paidAt: "desc" },
      });
      if (txns.length > 0) return txns;
    }
    return await feesRepository.getPayments(userId);
  }

  async getReceipts(userId) {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (student) {
      const txns = await prisma.feeTransaction.findMany({
        where: {
          studentId: student.id,
          status: "SUCCESS",
          receiptNumber: { not: null },
        },
        include: { invoice: true },
        orderBy: { paidAt: "desc" },
      });
      if (txns.length > 0) return txns;
    }
    return await feesRepository.getReceipts(userId);
  }

  async generateReceipt(receiptId) {
    // Check if receipt is from new FeeTransaction
    const txn = await prisma.feeTransaction.findFirst({
      where: {
        OR: [{ id: receiptId }, { receiptNumber: receiptId }],
      },
      include: { invoice: { include: { student: true } } },
    });

    if (txn && txn.pdfUrl) return txn.pdfUrl;

    const receipt = await feesRepository.getReceiptById(receiptId);
    if (!receipt && !txn) {
      throw new Error("Receipt not found");
    }

    if (receipt && receipt.pdfUrl) {
      return receipt.pdfUrl;
    }

    // Generate dynamic PDF
    const targetObj = receipt || txn;
    const pdfUrl = await receiptPdfService.generate(targetObj);

    if (receipt) {
      await feesRepository.updateReceiptPdf(receiptId, pdfUrl);
    } else if (txn) {
      await prisma.feeTransaction.update({
        where: { id: txn.id },
        data: { pdfUrl },
      });
    }

    return pdfUrl;
  }
}

module.exports = new FeesService();
