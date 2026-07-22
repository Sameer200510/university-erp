const prisma = require("../../../config/prisma");

class FeesRepository {
  async getFeeStructure(studentId) {
    return await prisma.feeStructure.findFirst({
      where: {
        studentId,
      },
    });
  }

  async getInstallments(studentId) {
    return await prisma.feeInstallment.findMany({
      where: {
        studentId,
      },
      orderBy: {
        semester: "asc",
      },
    });
  }

  async getPayments(studentId) {
    return await prisma.feePayment.findMany({
      where: {
        studentId,
      },
      orderBy: {
        paidAt: "desc",
      },
    });
  }

  async getReceipts(studentId) {
    return await prisma.feeReceipt.findMany({
      include: {
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getReceiptById(receiptId) {
    return await prisma.feeReceipt.findUnique({
      where: {
        id: receiptId,
      },
      include: {
        payment: true,
      },
    });
  }

  async updateReceiptPdf(receiptId, pdfUrl) {
    return await prisma.feeReceipt.update({
      where: {
        id: receiptId,
      },
      data: {
        pdfUrl,
      },
    });
  }
}

module.exports = new FeesRepository();
