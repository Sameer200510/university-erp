const admissionRepository = require('../repositories/admission.repository');

class AdmissionService {
  async getStatus(userId) {
    return await admissionRepository.getAdmissionStatus(userId);
  }

  async apply(userId) {
    return await admissionRepository.applyForAdmission(userId);
  }
}

module.exports = new AdmissionService();
