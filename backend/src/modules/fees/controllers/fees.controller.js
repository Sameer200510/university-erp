const feesService = require("../services/fees.service");
const feeAdminService = require("../services/feeAdmin.service");

class FeesController {
  // ================= STUDENT PORTAL ENDPOINTS =================

  async getDashboard(req, res) {
    try {
      const data = await feesService.getDashboard(req.user.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getStudentLedger(req, res) {
    try {
      const data = await feesService.getStudentLedger(req.user.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getStudentInvoices(req, res) {
    try {
      const data = await feesService.getStudentInvoices(req.user.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async payOnline(req, res) {
    try {
      const { invoiceId, amount, paymentMode, gatewayTxnId } = req.body;
      const data = await feesService.payOnline({
        userId: req.user.id,
        invoiceId,
        amount,
        paymentMode,
        gatewayTxnId,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getInstallments(req, res) {
    try {
      const data = await feesService.getInstallments(req.user.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getPayments(req, res) {
    try {
      const data = await feesService.getPayments(req.user.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getReceipts(req, res) {
    try {
      const data = await feesService.getReceipts(req.user.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async downloadReceipt(req, res) {
    try {
      const pdfUrl = await feesService.generateReceipt(req.params.receiptId);
      res.status(200).json({ success: true, pdfUrl });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ================= ADMIN / CASHIER PORTAL ENDPOINTS =================

  async getAdminDashboard(req, res) {
    try {
      const data = await feeAdminService.getDashboardMetrics();
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getFeeHeads(req, res) {
    try {
      const data = await feeAdminService.getFeeHeads();
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createFeeHead(req, res) {
    try {
      const data = await feeAdminService.createFeeHead(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getFeeMatrix(req, res) {
    try {
      const data = await feeAdminService.getFeeMatrix(req.query);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async saveFeeMatrixRule(req, res) {
    try {
      const data = await feeAdminService.saveFeeMatrixRule(req.body);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async generateSemesterInvoices(req, res) {
    try {
      const data = await feeAdminService.generateSemesterInvoices(req.body);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async collectOfflinePayment(req, res) {
    try {
      const data = await feeAdminService.collectOfflinePayment({
        ...req.body,
        collectedBy: req.user ? req.user.id : "Admin Counter",
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async markChequeBounce(req, res) {
    try {
      const { fineAmount } = req.body;
      const data = await feeAdminService.markChequeBounce(req.params.id, fineAmount);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async applyLateFees(req, res) {
    try {
      const data = await feeAdminService.applyLateFees();
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async sendReminders(req, res) {
    try {
      const data = await feeAdminService.sendReminders();
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new FeesController();
