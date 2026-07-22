const prisma = require("../../../config/prisma");

async function getSubjects(studentId) {
  return prisma.subjectAttendanceSummary.findMany({
    where: {
      studentId,
    },
    include: {
      subject: true,
    },
  });
}

async function getApplications(studentId) {
  const applications = await prisma.revaluationApplication.findMany({
    where: {
      studentId,
    },
    orderBy: {
      appliedAt: "desc",
    },
  });

  const subjects = await prisma.subject.findMany();

  return applications.map((app) => {
    const subject = subjects.find((s) => s.id === app.subjectId);

    return {
      ...app,

      subjectCode: subject?.code || "-",

      subjectName: subject?.name || "-",
    };
  });
}

async function createApplication(data) {
  return prisma.revaluationApplication.create({
    data,
  });
}

module.exports = {
  getSubjects,
  getApplications,
  createApplication,
};
