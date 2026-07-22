const feesRepository = require("../repositories/fees.repository");
const receiptPdfService = require("./receiptPdf.service");

class FeesService {
  async getDashboard(studentId) {
    const feeStructure = await feesRepository.getFeeStructure(studentId);

    const installments = await feesRepository.getInstallments(studentId);

    const paidAmount = installments
      .filter((i) => i.status === "PAID")
      .reduce((sum, i) => sum + i.amount, 0);

    const pendingAmount = feeStructure.netFee - paidAmount;

    const currentDue = installments.find((i) => i.status === "PENDING") || null;

    const progress =
      feeStructure.netFee > 0
        ? Number(((paidAmount / feeStructure.netFee) * 100).toFixed(2))
        : 0;

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

  async getInstallments(studentId) {
    return await feesRepository.getInstallments(studentId);
  }

  async getPayments(studentId) {
    return await feesRepository.getPayments(studentId);
  }

  async getReceipts(studentId) {
    return await feesRepository.getReceipts(studentId);
  }

  async generateReceipt(receiptId) {
    const receipt = await feesRepository.getReceiptById(receiptId);

    if (!receipt) {
      throw new Error("Receipt not found");
    }

    if (receipt.pdfUrl) {
      return receipt.pdfUrl;
    }

    const pdfUrl = await receiptPdfService.generate(receipt);

    await feesRepository.updateReceiptPdf(receiptId, pdfUrl);

    return pdfUrl;
  }
}

module.exports = new FeesService();
