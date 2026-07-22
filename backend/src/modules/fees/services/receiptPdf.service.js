const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

class ReceiptPdfService {
  generate(receipt) {
    return new Promise((resolve, reject) => {
      const receiptNo = receipt.receiptNo || receipt.receiptNumber || `REC-${Date.now()}`;
      const txnId = receipt.payment?.transactionId || receipt.transactionNo || receipt.gatewayTxnId || "N/A";
      const amount = receipt.payment?.amount || receipt.amount || 0;
      const mode = receipt.payment?.paymentMode || receipt.paymentMode || "ONLINE";
      const status = receipt.payment?.status || receipt.status || "SUCCESS";
      const dateStr = new Date(receipt.payment?.paidAt || receipt.paidAt || Date.now()).toLocaleDateString();

      const fileName = `${receiptNo}.pdf`;
      const targetDir = path.join(process.cwd(), "uploads", "receipts");
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const filePath = path.join(targetDir, fileName);
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      doc.fontSize(24);
      doc.text("GRAPHIC ERA UNIVERSITY", { align: "center" });
      doc.moveDown();

      doc.fontSize(18);
      doc.text("Official Fee Payment Receipt", { align: "center" });
      doc.moveDown();

      doc.fontSize(12);
      doc.text(`Receipt Number: ${receiptNo}`);
      doc.text(`Transaction Reference: ${txnId}`);
      doc.text(`Amount Paid: ₹${amount.toLocaleString("en-IN")}`);
      doc.text(`Payment Mode: ${mode}`);
      doc.text(`Transaction Status: ${status}`);
      doc.text(`Payment Date: ${dateStr}`);
      doc.moveDown(2);

      doc.fontSize(10);
      doc.text("This is an official system-generated computerized receipt from university-erp.", { align: "center" });
      doc.end();

      stream.on("finish", () => {
        resolve(`/uploads/receipts/${fileName}`);
      });

      stream.on("error", reject);
    });
  }
}

module.exports = new ReceiptPdfService();
