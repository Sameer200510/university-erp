const prisma = require("../../../config/prisma");

class SemesterRegistrationRepository {
  async getMyRegistration(studentId) {
    return await prisma.semesterRegistration.findFirst({
      where: {
        studentId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async createRegistration(data) {
    return await prisma.semesterRegistration.create({
      data,
    });
  }
}

module.exports = new SemesterRegistrationRepository();
