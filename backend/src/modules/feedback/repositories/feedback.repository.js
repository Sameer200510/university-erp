const prisma = require("../../../config/prisma");

class FeedbackRepository {
  async getFaculties() {
    return await prisma.faculty.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async createFeedback(data) {
    return await prisma.feedback.create({
      data,
    });
  }

  async checkFeedback(studentId, facultyId, semester) {
    return await prisma.feedback.findFirst({
      where: {
        studentId,
        facultyId,
        semester,
      },
    });
  }

  async getStudentFeedback(studentId) {
    return await prisma.feedback.findMany({
      where: {
        studentId,
      },
    });
  }
}

module.exports = new FeedbackRepository();
