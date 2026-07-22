const semesterRegistrationRepository = require("../repositories/semesterRegistration.repository");
const prisma = require("../../../config/prisma");

class SemesterRegistrationService {
  async getMyRegistration(studentId) {
    return await semesterRegistrationRepository.getMyRegistration(studentId);
  }

  async registerSemester(studentId) {
    const existing =
      await semesterRegistrationRepository.getMyRegistration(studentId);

    if (existing && existing.status === "PENDING") {
      throw new Error("Registration request already submitted");
    }

    const profile = await prisma.studentProfile.findFirst({
      where: {
        userId: studentId,
      },
    });

    const pendingFee = await prisma.feeInstallment.findFirst({
      where: {
        studentId,
        status: "PENDING",
      },
    });

    if (pendingFee) {
      throw new Error(
        "Pending fee dues found. Please clear fees before semester registration.",
      );
    }

    if (!profile) {
      throw new Error("Student profile not found");
    }

    if (!profile.currentSemester) {
      throw new Error(
        "Current semester not assigned. Please update student profile.",
      );
    }

    return await semesterRegistrationRepository.createRegistration({
      studentId,

      currentSemester: profile.currentSemester,

      nextSemester: profile.currentSemester + 1,

      status: "PENDING",
    });
  }
}

module.exports = new SemesterRegistrationService();
