const service = require("../services/admitCard.service");

class AdmitCardController {
  async getEligibility(req, res, next) {
    try {
      const data = await service.getEligibility(req.user.id);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async generateAdmitCard(req, res, next) {
    try {
      const data = await service.generateAdmitCard(req.user.id);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdmitCardController();
