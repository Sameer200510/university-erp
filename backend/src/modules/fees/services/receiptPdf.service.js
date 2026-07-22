const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

class ReceiptPdfService {
  generate(receipt) {
    return new Promise((resolve, reject) => {
      const fileName = `${receipt.receiptNo}.pdf`;

      const filePath = path.join(
        process.cwd(),
        "uploads",
        "receipts",
        fileName,
      );

      const doc = new PDFDocument();

      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      doc.fontSize(24);
      doc.text("GRAPHIC ERA UNIVERSITY", {
        align: "center",
      });

      doc.moveDown();

      doc.fontSize(18);
      doc.text("Fee Payment Receipt");

      doc.moveDown();

      doc.fontSize(12);

      doc.text(`Receipt No: ${receipt.receiptNo}`);

      doc.text(`Transaction ID: ${receipt.payment.transactionId}`);

      doc.text(`Amount: ₹${receipt.payment.amount}`);

      doc.text(`Payment Mode: ${receipt.payment.paymentMode}`);

      doc.text(`Status: ${receipt.payment.status}`);

      doc.text(
        `Date: ${new Date(receipt.payment.paidAt).toLocaleDateString()}`,
      );

      doc.moveDown(2);

      doc.text("This is a system generated receipt.");

      doc.end();

      stream.on("finish", () => {
        resolve(`/uploads/receipts/${fileName}`);
      });

      stream.on("error", reject);
    });
  }
}

module.exports = new ReceiptPdfService();
