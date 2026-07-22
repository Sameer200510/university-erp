require("dotenv").config({
  path: "./src/config/.env",
});

const prisma = require("../src/config/prisma");

async function seedFees() {
  try {
    console.log("🗑 Cleaning old fee data...");

    await prisma.feeReceipt.deleteMany({});
    await prisma.feePayment.deleteMany({});
    await prisma.feeInstallment.deleteMany({});
    await prisma.feeStructure.deleteMany({});

    console.log("🌱 Creating Fee Structure...");

    const feeStructure = await prisma.feeStructure.create({
      data: {
        studentId: "cc5293e6-ac73-4919-9708-452381d1fa44",

        totalFee: 1600000,

        scholarship: 200000,

        netFee: 1400000,

        durationYears: 4,

        totalSemesters: 8,
      },
    });

    const installmentAmount = 175000;

    const installments = [];

    for (let semester = 1; semester <= 8; semester++) {
      const installment = await prisma.feeInstallment.create({
        data: {
          feeStructureId: feeStructure.id,

          studentId: "cc5293e6-ac73-4919-9708-452381d1fa44",

          semester,

          amount: installmentAmount,

          dueDate: new Date(2026, semester - 1, 15),

          status: semester <= 3 ? "PAID" : "PENDING",

          paidAt: semester <= 3 ? new Date() : null,
        },
      });

      installments.push(installment);
    }

    console.log("💳 Creating Payments...");

    for (let i = 0; i < 3; i++) {
      const payment = await prisma.feePayment.create({
        data: {
          installmentId: installments[i].id,

          studentId: "cc5293e6-ac73-4919-9708-452381d1fa44",

          amount: installmentAmount,

          transactionId: `TXN2026${i + 1}`,

          paymentMode: "UPI",

          status: "SUCCESS",
        },
      });

      await prisma.feeReceipt.create({
        data: {
          paymentId: payment.id,

          receiptNo: `REC2026${i + 1}`,
        },
      });
    }

    console.log("✅ Fee Data Seeded Successfully");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seedFees();
