const admissionService = require('../services/admission.service');

class AdmissionController {
  async getStatus(req, res) {
    try {
      const userId = req.user.id;
      const admission = await admissionService.getStatus(userId);
      res.status(200).json({ admission });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async apply(req, res) {
    try {
      const userId = req.user.id;
      const admission = await admissionService.apply(userId);
      res.status(201).json({ message: 'Application submitted', admission });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new AdmissionController();
