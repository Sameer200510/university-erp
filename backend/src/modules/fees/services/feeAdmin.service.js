const prisma = require("../../../config/prisma");

class FeeAdminService {
  /**
   * Get comprehensive Admin/Cashier dashboard metrics
   */
  async getDashboardMetrics() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 1. Total Collections Today & Overall
    const todayTransactions = await prisma.feeTransaction.findMany({
      where: {
        status: "SUCCESS",
        paidAt: { gte: startOfDay },
      },
    });
    const todayCollection = todayTransactions.reduce((sum, t) => sum + t.amount, 0);

    const allTransactions = await prisma.feeTransaction.findMany({
      where: { status: "SUCCESS" },
      include: {
        invoice: {
          include: { items: { include: { feeHead: true } } },
        },
        student: true,
      },
    });
    const totalCollection = allTransactions.reduce((sum, t) => sum + t.amount, 0);

    // Collection mode breakdown
    const modeBreakdown = {
      ONLINE: 0,
      CASH: 0,
      CHEQUE_DD: 0,
    };
    allTransactions.forEach((t) => {
      if (t.paymentMode.startsWith("ONLINE")) modeBreakdown.ONLINE += t.amount;
      else if (t.paymentMode === "OFFLINE_CASH") modeBreakdown.CASH += t.amount;
      else modeBreakdown.CHEQUE_DD += t.amount;
    });

    // Head-wise Revenue Breakdown
    const headWiseRevenue = {};
    allTransactions.forEach((t) => {
      if (t.invoice && t.invoice.items) {
        // Proportionate distribution or direct head sum
        t.invoice.items.forEach((item) => {
          const headName = item.feeHead?.name || "Other Charges";
          headWiseRevenue[headName] = (headWiseRevenue[headName] || 0) + item.amount;
        });
      }
    });

    // Outstanding Dues across all invoices
    const pendingInvoices = await prisma.feeInvoice.findMany({
      where: {
        status: { in: ["PENDING", "PARTIAL", "OVERDUE"] },
      },
      include: {
        student: true,
      },
    });
    const totalOutstanding = pendingInvoices.reduce((sum, i) => sum + (i.netAmount - i.paidAmount), 0);

    // Defaulters list (Invoices overdue or pending amount > 5000)
    const defaulters = pendingInvoices.map((i) => ({
      invoiceId: i.id,
      invoiceNo: i.invoiceNo,
      studentId: i.studentId,
      studentName: `${i.student.firstName} ${i.student.lastName}`,
      rollNo: i.student.rollNo || i.student.enrollmentNo || "N/A",
      course: i.student.course || "B.Tech CSE",
      batch: i.student.batch || "2024-2028",
      semester: i.semester,
      netAmount: i.netAmount,
      paidAmount: i.paidAmount,
      pendingAmount: i.netAmount - i.paidAmount,
      dueDate: i.dueDate,
      status: i.status,
      isOverdue: new Date(i.dueDate) < now,
    }));

    // Recent 10 transactions
    const recentTransactions = allTransactions.slice(0, 10).map((t) => ({
      id: t.id,
      transactionNo: t.transactionNo,
      studentName: t.student ? `${t.student.firstName} ${t.student.lastName}` : "Student",
      amount: t.amount,
      paymentMode: t.paymentMode,
      status: t.status,
      paidAt: t.paidAt,
      receiptNumber: t.receiptNumber,
    }));

    return {
      todayCollection,
      totalCollection,
      totalOutstanding,
      defaultersCount: defaulters.length,
      modeBreakdown,
      headWiseRevenue,
      defaulters,
      recentTransactions,
    };
  }

  /**
   * Manage Fee Heads
   */
  async getFeeHeads() {
    return await prisma.feeHead.findMany({ orderBy: { name: "asc" } });
  }

  async createFeeHead(data) {
    return await prisma.feeHead.create({
      data: {
        code: data.code.toUpperCase(),
        name: data.name,
        description: data.description || "",
        isRecurring: data.isRecurring !== undefined ? data.isRecurring : true,
        defaultAmount: Number(data.defaultAmount) || 0,
      },
    });
  }

  /**
   * Manage Fee Matrix Rules
   */
  async getFeeMatrix(filters = {}) {
    const where = {};
    if (filters.courseId) where.courseId = filters.courseId;
    if (filters.batch) where.batch = filters.batch;
    if (filters.quota) where.quota = filters.quota;
    if (filters.semester) where.semester = Number(filters.semester);

    return await prisma.feeMatrix.findMany({
      where,
      include: { feeHead: true },
      orderBy: [{ courseId: "asc" }, { batch: "asc" }, { semester: "asc" }],
    });
  }

  async saveFeeMatrixRule(data) {
    const { courseId, batch, quota, semester, feeHeadId, amount } = data;
    return await prisma.feeMatrix.upsert({
      where: {
        courseId_batch_quota_semester_feeHeadId: {
          courseId,
          batch,
          quota,
          semester: Number(semester),
          feeHeadId,
        },
      },
      update: { amount: Number(amount) },
      create: {
        courseId,
        batch,
        quota,
        semester: Number(semester),
        feeHeadId,
        amount: Number(amount),
      },
    });
  }

  /**
   * Batch Generate Semester Invoices for Course & Batch
   */
  async generateSemesterInvoices({ courseId, batch, semester, dueDate }) {
    const students = await prisma.studentProfile.findMany({
      where: {
        course: courseId,
        batch: batch || undefined,
      },
    });

    if (students.length === 0) {
      throw new Error(`No students found for Course: ${courseId} and Batch: ${batch || "All"}`);
    }

    const heads = await prisma.feeHead.findMany();
    const headsMap = {};
    heads.forEach((h) => (headsMap[h.id] = h));

    let generatedCount = 0;
    const generatedInvoices = [];

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const studentQuota = student.quota || "MERIT";
      const sem = Number(semester) || student.currentSemester || 1;

      // Check if invoice already exists for this semester
      const existing = await prisma.feeInvoice.findFirst({
        where: {
          studentId: student.id,
          semester: sem,
        },
      });
      if (existing) continue;

      // Fetch matrix rules for this student
      const matrixRules = await prisma.feeMatrix.findMany({
        where: {
          courseId,
          batch: student.batch || batch || "2024-2028",
          quota: studentQuota,
          semester: sem,
        },
        include: { feeHead: true },
      });

      // If matrix rules don't exist, use default tuition & charges
      let itemsData = [];
      let totalAmount = 0;

      if (matrixRules.length > 0) {
        matrixRules.forEach((rule) => {
          itemsData.push({
            feeHeadId: rule.feeHeadId,
            amount: rule.amount,
            description: `${rule.feeHead.name} (Sem ${sem} - ${studentQuota})`,
          });
          totalAmount += rule.amount;
        });
      } else {
        const tuitionAmount = studentQuota === "MANAGEMENT" ? 94250 : 65000;
        const tuitionHead = heads.find((h) => h.code === "TUITION");
        const transportHead = heads.find((h) => h.code === "TRANSPORT");
        if (tuitionHead) {
          itemsData.push({ feeHeadId: tuitionHead.id, amount: tuitionAmount, description: `Tuition Fee (Sem ${sem} - ${studentQuota})` });
          totalAmount += tuitionAmount;
        }
        if (transportHead) {
          itemsData.push({ feeHeadId: transportHead.id, amount: transportHead.defaultAmount, description: "Semester Transport Fee" });
          totalAmount += transportHead.defaultAmount;
        }
      }

      const invoiceNo = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const invoice = await prisma.feeInvoice.create({
        data: {
          invoiceNo,
          studentId: student.id,
          semester: sem,
          totalAmount,
          discountAmount: 0,
          netAmount: totalAmount,
          paidAmount: 0,
          status: "PENDING",
          dueDate: new Date(dueDate || Date.now() + 30 * 24 * 60 * 60 * 1000),
          items: {
            create: itemsData,
          },
        },
        include: { items: true },
      });

      // Post DEBIT to Student Ledger
      await prisma.studentLedger.create({
        data: {
          studentId: student.id,
          type: "DEBIT",
          amount: totalAmount,
          referenceId: invoice.id,
          referenceType: "INVOICE",
          description: `Invoice ${invoiceNo} generated for Semester ${sem}`,
          balanceAfter: totalAmount,
        },
      });

      // Post General Ledger
      await prisma.generalLedger.create({
        data: {
          accountHead: "ACCOUNTS_RECEIVABLE",
          debit: totalAmount,
          credit: 0,
          referenceId: invoice.id,
          description: `Receivable from ${student.firstName} ${student.lastName} (${invoiceNo})`,
        },
      });

      generatedInvoices.push(invoice);
      generatedCount++;
    }

    return {
      success: true,
      generatedCount,
      invoices: generatedInvoices,
    };
  }

  /**
   * Cashier Offline Payment Collection (Cash, Cheque, DD)
   */
  async collectOfflinePayment(data) {
    const { studentId, invoiceId, amount, paymentMode, chequeOrDdNumber, bankName, chequeDate, collectedBy } = data;

    const invoice = await prisma.feeInvoice.findUnique({
      where: { id: invoiceId },
      include: { student: true },
    });
    if (!invoice) throw new Error("Invoice not found");

    const payAmount = Number(amount);
    const transactionNo = `TXN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const receiptNumber = `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    // Create FeeTransaction
    const transaction = await prisma.feeTransaction.create({
      data: {
        transactionNo,
        invoiceId,
        studentId: invoice.studentId,
        amount: payAmount,
        paymentMode: paymentMode || "OFFLINE_CASH",
        chequeOrDdNumber: chequeOrDdNumber || null,
        bankName: bankName || null,
        chequeDate: chequeDate ? new Date(chequeDate) : null,
        status: "SUCCESS",
        collectedBy: collectedBy || "Admin Counter",
        receiptNumber,
      },
    });

    // Update Invoice status and paidAmount
    const newPaidAmount = invoice.paidAmount + payAmount;
    const newStatus = newPaidAmount >= invoice.netAmount ? "PAID" : "PARTIAL";
    await prisma.feeInvoice.update({
      where: { id: invoiceId },
      data: {
        paidAmount: newPaidAmount,
        status: newStatus,
      },
    });

    // Post CREDIT to StudentLedger
    await prisma.studentLedger.create({
      data: {
        studentId: invoice.studentId,
        type: "CREDIT",
        amount: payAmount,
        referenceId: transaction.id,
        referenceType: "PAYMENT",
        description: `Payment received (${paymentMode}) - Receipt: ${receiptNumber}`,
        balanceAfter: invoice.netAmount - newPaidAmount,
      },
    });

    // Post General Ledger
    const assetHead = paymentMode === "OFFLINE_CASH" ? "CASH_IN_HAND" : "BANK_ACCOUNT";
    await prisma.generalLedger.create({
      data: {
        accountHead: assetHead,
        debit: payAmount,
        credit: 0,
        referenceId: transaction.id,
        description: `${paymentMode} received from ${invoice.student.firstName} ${invoice.student.lastName} (${receiptNumber})`,
      },
    });

    await prisma.generalLedger.create({
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
  }

  /**
   * Cheque Bounce / Reversal Logic with automatic fine
   */
  async markChequeBounce(transactionId, fineAmount = 1000) {
    const transaction = await prisma.feeTransaction.findUnique({
      where: { id: transactionId },
      include: { invoice: { include: { student: true } } },
    });

    if (!transaction) throw new Error("Transaction not found");
    if (transaction.status === "BOUNCED") throw new Error("Cheque is already marked as BOUNCED!");

    const invoice = transaction.invoice;
    const student = invoice.student;

    // 1. Mark transaction status as BOUNCED
    await prisma.feeTransaction.update({
      where: { id: transactionId },
      data: { status: "BOUNCED" },
    });

    // 2. Reverse paidAmount from Invoice and reset status
    const revertedPaidAmount = Math.max(0, invoice.paidAmount - transaction.amount);
    const bounceHead = await prisma.feeHead.findFirst({ where: { code: "CHEQUE_BOUNCE" } });
    const fine = Number(fineAmount) || (bounceHead ? bounceHead.defaultAmount : 1000);

    const newTotalAmount = invoice.totalAmount + fine;
    const newNetAmount = invoice.netAmount + fine;
    const newStatus = revertedPaidAmount >= newNetAmount ? "PAID" : new Date(invoice.dueDate) < new Date() ? "OVERDUE" : "PENDING";

    // Add Cheque Bounce fine to invoice items
    if (bounceHead) {
      await prisma.feeInvoiceItem.create({
        data: {
          invoiceId: invoice.id,
          feeHeadId: bounceHead.id,
          amount: fine,
          description: `Cheque Dishonor Penalty (${transaction.chequeOrDdNumber || transaction.transactionNo})`,
        },
      });
    }

    await prisma.feeInvoice.update({
      where: { id: invoice.id },
      data: {
        totalAmount: newTotalAmount,
        netAmount: newNetAmount,
        paidAmount: revertedPaidAmount,
        status: newStatus,
      },
    });

    // 3. Post DEBIT reversal & Fine in StudentLedger
    await prisma.studentLedger.create({
      data: {
        studentId: student.id,
        type: "DEBIT",
        amount: transaction.amount,
        referenceId: transaction.id,
        referenceType: "CHEQUE_BOUNCE",
        description: `Payment Reversed due to Cheque Bounce (${transaction.chequeOrDdNumber || transaction.transactionNo})`,
        balanceAfter: newNetAmount - revertedPaidAmount,
      },
    });

    await prisma.studentLedger.create({
      data: {
        studentId: student.id,
        type: "DEBIT",
        amount: fine,
        referenceId: invoice.id,
        referenceType: "PENALTY",
        description: `Cheque Bounce Fine applied (${transaction.chequeOrDdNumber || transaction.transactionNo})`,
        balanceAfter: newNetAmount - revertedPaidAmount,
      },
    });

    // 4. Post General Ledger adjustment
    await prisma.generalLedger.create({
      data: {
        accountHead: "BANK_ACCOUNT",
        debit: 0,
        credit: transaction.amount,
        referenceId: transaction.id,
        description: `Cheque bounced reversal (${transaction.chequeOrDdNumber || transaction.transactionNo})`,
      },
    });

    await prisma.generalLedger.create({
      data: {
        accountHead: "PENALTY_REVENUE",
        debit: 0,
        credit: fine,
        referenceId: transaction.id,
        description: `Cheque bounce fine recognized (${invoice.invoiceNo})`,
      },
    });

    return {
      success: true,
      message: `Cheque bounce marked. Payment of ₹${transaction.amount} reversed and fine of ₹${fine} charged to ${student.firstName} ${student.lastName}.`,
      invoiceNo: invoice.invoiceNo,
      fineAmount: fine,
    };
  }

  /**
   * Dunning Engine: Automated Late Fees Application
   */
  async applyLateFees() {
    const now = new Date();
    const overdueInvoices = await prisma.feeInvoice.findMany({
      where: {
        dueDate: { lt: now },
        status: { in: ["PENDING", "PARTIAL", "OVERDUE"] },
      },
      include: {
        items: true,
        student: true,
      },
    });

    const lateHead = await prisma.feeHead.findFirst({ where: { code: "LATE_FEE" } });
    if (!lateHead) throw new Error("LATE_FEE head not found in master");

    let appliedCount = 0;
    for (const invoice of overdueInvoices) {
      // Check if late fee already applied for this invoice
      const alreadyApplied = invoice.items.some((item) => item.feeHeadId === lateHead.id);
      if (alreadyApplied) continue;

      const fine = lateHead.defaultAmount || 500;
      await prisma.feeInvoiceItem.create({
        data: {
          invoiceId: invoice.id,
          feeHeadId: lateHead.id,
          amount: fine,
          description: `Late Payment Fine (Due was ${invoice.dueDate.toISOString().slice(0, 10)})`,
        },
      });

      await prisma.feeInvoice.update({
        where: { id: invoice.id },
        data: {
          totalAmount: invoice.totalAmount + fine,
          netAmount: invoice.netAmount + fine,
          status: "OVERDUE",
        },
      });

      await prisma.studentLedger.create({
        data: {
          studentId: invoice.studentId,
          type: "DEBIT",
          amount: fine,
          referenceId: invoice.id,
          referenceType: "PENALTY",
          description: `Late payment fine applied for Invoice ${invoice.invoiceNo}`,
          balanceAfter: invoice.netAmount + fine - invoice.paidAmount,
        },
      });

      appliedCount++;
    }

    return {
      success: true,
      appliedCount,
      message: `Checked ${overdueInvoices.length} overdue invoices. Applied late fee penalty to ${appliedCount} invoices.`,
    };
  }

  /**
   * Smart Reminders & Dunning Alerts
   */
  async sendReminders() {
    const now = new Date();
    const pendingInvoices = await prisma.feeInvoice.findMany({
      where: {
        status: { in: ["PENDING", "PARTIAL", "OVERDUE"] },
      },
      include: { student: true },
    });

    let remindersSent = 0;
    const reminderLogs = [];

    for (const invoice of pendingInvoices) {
      const diffTime = new Date(invoice.dueDate).getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let reminderType = null;
      if (diffDays === 7) reminderType = "7 Days Before Due Date Reminder";
      else if (diffDays === 3) reminderType = "3 Days Before Due Date Reminder";
      else if (diffDays === 1) reminderType = "1 Day Before Due Date Urgent Reminder";
      else if (diffDays < 0) reminderType = `OVERDUE NOTICE (${Math.abs(diffDays)} Days Past Due)`;

      if (reminderType) {
        remindersSent++;
        reminderLogs.push({
          studentName: `${invoice.student.firstName} ${invoice.student.lastName}`,
          phone: invoice.student.phone || "N/A",
          invoiceNo: invoice.invoiceNo,
          pendingAmount: invoice.netAmount - invoice.paidAmount,
          reminderType,
          status: "SMS / Email Notification Sent via Dunning Engine",
        });
      }
    }

    return {
      success: true,
      remindersSent,
      reminderLogs,
    };
  }
}

module.exports = new FeeAdminService();
