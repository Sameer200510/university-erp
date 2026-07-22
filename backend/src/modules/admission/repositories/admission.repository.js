const prisma = require("../../../config/prisma");

class AdmissionRepository {
  async getAdmissionStatus(userId) {
    return await prisma.admission.findUnique({
      where: { userId },
    });
  }

  async applyForAdmission(userId) {
    return await prisma.admission.upsert({
      where: { userId },
      update: {}, // if exists, just return it
      create: {
        userId,
        status: "APPLIED",
      },
    });
  }
}

module.exports = new AdmissionRepository();
