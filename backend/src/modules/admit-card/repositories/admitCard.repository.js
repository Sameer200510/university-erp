const prisma = require("../../../config/prisma");

class AdmitCardRepository {
  async getAttendanceConfig() {
    return prisma.admitCardConfig.findFirst();
  }

  async getSubjectAttendance(studentId) {
    return prisma.subjectAttendanceSummary.findMany({
      where: {
        studentId,
      },
      include: {
        subject: true,
      },
    });
  }

  async getRelaxations(studentId) {
    return prisma.attendanceRelaxation.findMany({
      where: {
        studentId,
        status: "APPROVED",
      },
    });
  }

  async getReleaseStatus(semester) {
    return prisma.admitCardRelease.findFirst({
      where: {
        semester,
      },
    });
  }

  async createAdmitCard(data) {
    return prisma.admitCard.create({
      data,
    });
  }

  async getLatestAdmitCard(studentId) {
    return prisma.admitCard.findFirst({
      where: {
        studentId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getStudentDetails(studentId) {
    return prisma.studentProfile.findFirst({
      where: {
        userId: studentId,
      },
    });
  }

  async getStudentDetails(studentId) {
    return prisma.studentProfile.findFirst({
      where: {
        userId: studentId,
      },
    });
  }

  async getSubjects(studentId) {
    return prisma.subjectAttendanceSummary.findMany({
      where: {
        studentId,
      },
      include: {
        subject: true,
      },
    });
  }
}

module.exports = new AdmitCardRepository();
