const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../src/config/.env"),
});
const prisma = require("../src/config/prisma");

async function seedFeesMaster() {
  console.log("🌱 Starting Fees Master & Matrix Seeding...");

  try {
    // 1. Seed Fee Heads
    const feeHeadsData = [
      { code: "TUITION", name: "Tuition Fee", description: "Semester Academic Tuition Charges", isRecurring: true, defaultAmount: 65000 },
      { code: "TRANSPORT", name: "Transport & Bus Fee", description: "Semester Bus & Shuttle Service Charges", isRecurring: true, defaultAmount: 12000 },
      { code: "LAB", name: "Laboratory & Practical Fee", description: "Computer & Engineering Lab Maintenance", isRecurring: true, defaultAmount: 5000 },
      { code: "LIBRARY", name: "Library Membership & Resources", description: "Digital & Physical Library Access", isRecurring: true, defaultAmount: 2000 },
      { code: "LATE_FEE", name: "Late Payment Penalty", description: "Fine imposed for fee payment past due date", isRecurring: false, defaultAmount: 500 },
      { code: "CHEQUE_BOUNCE", name: "Cheque Bounce Fine", description: "Bank cheque dishonored / bounce penalty charge", isRecurring: false, defaultAmount: 1000 },
    ];

    const headsMap = {};
    for (const item of feeHeadsData) {
      const head = await prisma.feeHead.upsert({
        where: { code: item.code },
        update: item,
        create: item,
      });
      headsMap[item.code] = head;
      console.log(`✅ FeeHead synced: ${head.name} (${head.code})`);
    }

    // 2. Seed Fee Matrix for B.Tech CSE (Batch 2024-2028 & 2026-2030) - MERIT vs MANAGEMENT Quota
    const courses = ["B.Tech CSE", "B.Tech ME", "MBA"];
    const batches = ["2024-2028", "2026-2030"];
    const quotas = [
      { quota: "MERIT", tuitionMult: 1.0 },
      { quota: "MANAGEMENT", tuitionMult: 1.45 },
      { quota: "NRI", tuitionMult: 2.0 },
    ];

    let matrixCount = 0;
    for (const courseId of courses) {
      for (const batch of batches) {
        for (const q of quotas) {
          for (let semester = 1; semester <= 8; semester++) {
            if (semester > 4) continue;

            const matrixRules = [
              { code: "TUITION", amount: headsMap["TUITION"].defaultAmount * q.tuitionMult },
              { code: "TRANSPORT", amount: headsMap["TRANSPORT"].defaultAmount },
              { code: "LAB", amount: headsMap["LAB"].defaultAmount },
              { code: "LIBRARY", amount: headsMap["LIBRARY"].defaultAmount },
            ];

            for (const rule of matrixRules) {
              const head = headsMap[rule.code];
              await prisma.feeMatrix.upsert({
                where: {
                  courseId_batch_quota_semester_feeHeadId: {
                    courseId,
                    batch,
                    quota: q.quota,
                    semester,
                    feeHeadId: head.id,
                  },
                },
                update: { amount: rule.amount },
                create: {
                  courseId,
                  batch,
                  quota: q.quota,
                  semester,
                  feeHeadId: head.id,
                  amount: rule.amount,
                },
              });
              matrixCount++;
            }
          }
        }
      }
    }
    console.log(`✅ Seeded ${matrixCount} Fee Matrix rules across courses, batches and quotas!`);

    // 3. Find sample students to generate initial FeeInvoices & Ledgers if any exist
    const students = await prisma.studentProfile.findMany({ take: 5 });
    if (students.length > 0) {
      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const semester = student.currentSemester || 1;
        const quota = student.quota || "MERIT";
        const course = student.course || "B.Tech CSE";
        const batch = student.batch || "2024-2028";

        const invoiceNo = `INV-2026-000${i + 1}`;
        const existingInvoice = await prisma.feeInvoice.findUnique({ where: { invoiceNo } });

        if (!existingInvoice) {
          const tuitionAmount = quota === "MANAGEMENT" ? 94250 : 65000;
          const totalAmount = tuitionAmount + 12000 + 5000 + 2000;
          const discountAmount = i === 1 ? 10000 : 0;
          const netAmount = totalAmount - discountAmount;

          const invoice = await prisma.feeInvoice.create({
            data: {
              invoiceNo,
              studentId: student.id,
              semester,
              totalAmount,
              discountAmount,
              netAmount,
              paidAmount: 0,
              status: "PENDING",
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              items: {
                create: [
                  { feeHeadId: headsMap["TUITION"].id, amount: tuitionAmount, description: `${course} Semester ${semester} Tuition (${quota})` },
                  { feeHeadId: headsMap["TRANSPORT"].id, amount: 12000, description: "Semester Transport Fee" },
                  { feeHeadId: headsMap["LAB"].id, amount: 5000, description: "Computer & Engineering Lab Fee" },
                  { feeHeadId: headsMap["LIBRARY"].id, amount: 2000, description: "Library Membership" },
                ],
              },
            },
          });

          await prisma.studentLedger.create({
            data: {
              studentId: student.id,
              type: "DEBIT",
              amount: netAmount,
              referenceId: invoice.id,
              referenceType: "INVOICE",
              description: `Invoice ${invoiceNo} generated for Semester ${semester} (${quota} Quota)`,
              balanceAfter: netAmount,
            },
          });

          await prisma.generalLedger.create({
            data: {
              accountHead: "ACCOUNTS_RECEIVABLE",
              debit: netAmount,
              credit: 0,
              referenceId: invoice.id,
              description: `Receivable from ${student.firstName} ${student.lastName} (Invoice ${invoiceNo})`,
            },
          });

          await prisma.generalLedger.create({
            data: {
              accountHead: "TUITION_REVENUE",
              debit: 0,
              credit: tuitionAmount,
              referenceId: invoice.id,
              description: `Tuition revenue recognized for Invoice ${invoiceNo}`,
            },
          });

          console.log(`🧾 Sample Invoice ${invoiceNo} (₹${netAmount}) & Ledger entries generated for ${student.firstName} ${student.lastName}`);
        }
      }
    }

    console.log("🎉 All Fees Master seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedFeesMaster();
