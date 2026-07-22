const prisma = require('../../../config/prisma');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'farwellcse2026@gmail.com',
    pass: process.env.GMAIL_PASS || 'tmbjcxqgsbbxijnb',
  },
});

class LeadService {
  async createLead(data) {
    return await prisma.admissionLead.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        courseId: data.courseId,
        status: 'PENDING_PAYMENT',
        payment: {
          create: { amount: 1500, status: 'PENDING' }
        }
      },
      include: { payment: true }
    });
  }

  async uploadDocument(leadId, fileUrl) {
    return await prisma.documentFile.create({
      data: {
        admissionLeadId: leadId,
        fileUrl: fileUrl,
      }
    });
  }

  async getLeadById(id) {
    let lead;
    if (id.length <= 8) {
      const leads = await prisma.admissionLead.findMany({
        where: { id: { startsWith: id.toLowerCase() } },
        include: { documents: true, payment: true }
      });
      lead = leads[0] || null;
    } else {
      lead = await prisma.admissionLead.findUnique({
        where: { id },
        include: { documents: true, payment: true }
      });
    }
    
    if (lead && lead.email) {
      const user = await prisma.user.findFirst({ where: { email: lead.email } });
      if (user) {
        lead.studentProfile = { erpId: user.loginId };
      }
    }
    return lead;
  }

  async getLeads() {
    return await prisma.admissionLead.findMany({
      include: { payment: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updatePaymentStatus(leadId, status, adminId, ipAddress) {
    const lead = await this.getLeadById(leadId);
    if (!lead) throw new Error('Lead not found');
    const payment = await prisma.payment.findUnique({ where: { admissionLeadId: lead.id } });
    if (!payment) throw new Error('Payment not found');
    const oldStatus = payment.status;
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: { status }
    });

    // If status becomes PAID, update lead status accordingly
    if (status === 'PAID' || status === 'SUCCESS') {
      await prisma.admissionLead.update({
        where: { id: lead.id },
        data: { status: 'PAID' }
      });
    }

    // Audit Log
    if (adminId) {
      await prisma.auditLog.create({
        data: {
          userId: adminId,
          action: 'UPDATE_PAYMENT_STATUS',
          entityType: 'Payment',
          entityId: payment.id,
          oldValue: oldStatus,
          newValue: status,
          ipAddress: ipAddress || null
        }
      });
    }

    return updatedPayment;
  }

  async processFinancePayment(referenceId, paymentData = {}, adminId, ipAddress) {
    const lead = await this.getLeadById(referenceId);
    if (!lead) throw new Error('Admission application / Reference_ID not found');

    let payment = await prisma.payment.findUnique({ where: { admissionLeadId: lead.id } });
    const oldStatus = payment ? payment.status : 'UNPAID';

    if (!payment) {
      payment = await prisma.payment.create({
        data: {
          amount: paymentData.amount || 1500,
          status: 'PAID',
          paymentMode: paymentData.paymentMode || 'CASH',
          transactionRef: paymentData.transactionRef || null,
          paidAt: new Date(),
          admissionLeadId: lead.id,
        }
      });
    } else {
      payment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'PAID',
          paymentMode: paymentData.paymentMode || 'CASH',
          transactionRef: paymentData.transactionRef || null,
          paidAt: new Date(),
        }
      });
    }

    const updatedLead = await prisma.admissionLead.update({
      where: { id: lead.id },
      data: { status: 'PAID' }
    });

    if (adminId) {
      await prisma.auditLog.create({
        data: {
          userId: adminId,
          action: 'PROCESS_FINANCE_FEE_PAYMENT',
          entityType: 'Payment',
          entityId: payment.id,
          oldValue: oldStatus,
          newValue: 'PAID',
          ipAddress: ipAddress || null
        }
      });
    }

    return { lead: updatedLead, payment };
  }

  async updateStatus(leadId, status, adminId, ipAddress) {
    const lead = await this.getLeadById(leadId);
    if (!lead) throw new Error('Lead not found');
    const oldStatus = lead.status;
    const updatedLead = await prisma.admissionLead.update({
      where: { id: lead.id },
      data: { status }
    });

    // Audit Log
    if (adminId) {
      await prisma.auditLog.create({
        data: {
          userId: adminId,
          action: 'UPDATE_ADMISSION_LEAD_STATUS',
          entityType: 'AdmissionLead',
          entityId: leadId,
          oldValue: oldStatus,
          newValue: status,
          ipAddress: ipAddress || null
        }
      });
    }

    return updatedLead;
  }

  async approveLead(leadId, adminId, ipAddress) {
    const lead = await this.getLeadById(leadId);
    if (!lead) throw new Error('Lead not found');

    // Mandatory Fee Payment Check
    if (!lead.payment || (lead.payment.status !== 'PAID' && lead.payment.status !== 'SUCCESS')) {
      throw new Error(`Admission approval denied: Mandatory Fee Payment is UNPAID (or Pending) for Reference_ID ${lead.id || leadId}. The student must complete payment at the Finance Office before admission can be approved.`);
    }

    const updatedLead = await prisma.admissionLead.update({
      where: { id: lead.id },
      data: { status: 'APPROVED' }
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'APPROVE_ADMISSION_LEAD',
        entityType: 'AdmissionLead',
        entityId: lead.id,
        oldValue: 'PENDING',
        newValue: 'APPROVED',
        ipAddress: ipAddress || null
      }
    });

    // Simulate ERP Account Generation
    const erpId = `${new Date().getFullYear()}${Math.floor(10000 + Math.random() * 90000)}`;
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    try {
      const user = await prisma.user.create({
        data: {
          email: lead.email,
          loginId: erpId,
          passwordHash: hashedPassword,
          role: 'STUDENT',
        },
      });

      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          firstName: lead.firstName,
          lastName: lead.lastName,
          phone: lead.phone,
          course: lead.courseId || ''
        },
      });

      await transporter.sendMail({
        from: process.env.GMAIL_USER ? `Admissions <${process.env.GMAIL_USER}>` : 'Admissions',
        to: lead.email,
        subject: 'Admission Approved - Your Login Credentials',
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2 style="color: #1e3a8a;">Hello ${lead.firstName},</h2>
            <p>Your application has been approved and your payment has been processed!</p>
            <p>You can now log in to the Graphic Era ERP student portal.</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Your ERP Login ID:</strong> ${erpId}</p>
              <p style="margin: 5px 0;"><strong>Your Password:</strong> ${tempPassword}</p>
            </div>
            <p>Welcome to Graphic Era University!</p>
            <p>Office of Admissions</p>
          </div>
        `,
      });
    } catch (err) {
      console.error("Account generation or email failed:", err);
    }

    return updatedLead;
  }
}

module.exports = new LeadService();