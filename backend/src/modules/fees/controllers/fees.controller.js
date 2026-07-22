const feesService = require("../services/fees.service");

class FeesController {
  async getDashboard(req, res) {
    try {
      const data = await feesService.getDashboard(req.user.id);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getInstallments(req, res) {
    try {
      const data = await feesService.getInstallments(req.user.id);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getPayments(req, res) {
    try {
      const data = await feesService.getPayments(req.user.id);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getReceipts(req, res) {
    try {
      const data = await feesService.getReceipts(req.user.id);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async downloadReceipt(req, res) {
    try {
      const pdfUrl = await feesService.generateReceipt(req.params.receiptId);

      res.status(200).json({
        success: true,
        pdfUrl,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new FeesController();
