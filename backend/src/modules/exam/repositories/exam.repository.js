const prisma = require("../../../config/prisma");

async function getLatestResult(studentId) {
  return prisma.result.findFirst({
    where: { studentId },
    orderBy: { semester: "desc" },
  });
}

async function getResults(studentId) {
  return prisma.result.findMany({
    where: { studentId },
    orderBy: {
      semester: "asc",
    },
  });
}

async function getMarks(studentId) {
  return prisma.marks.findMany({
    where: { studentId },
    orderBy: {
      semester: "asc",
    },
  });
}

async function getBackPapers(studentId) {
  return prisma.backPaperApplication.findMany({
    where: {
      studentId,
    },
    orderBy: {
      appliedAt: "desc",
    },
  });
}

async function applyBackPaper(data) {
  return prisma.backPaperApplication.create({
    data,
  });
}

async function getMarksheets(studentId) {
  return prisma.marksheet.findMany({
    where: {
      studentId,
    },
    orderBy: {
      semester: "asc",
    },
  });
}

async function getStudentProfile(studentId) {
  return prisma.studentProfile.findFirst({
    where: {
      userId: studentId,
    },
  });
}

async function getSemesterResult(studentId, semester) {
  return prisma.result.findFirst({
    where: {
      studentId,
      semester,
    },
  });
}

async function getSemesterMarks(studentId, semester) {
  return prisma.marks.findMany({
    where: {
      studentId,
      semester,
    },

    include: {
      subject: true,
    },

    orderBy: {
      subjectId: "asc",
    },
  });
}

module.exports = {
  getLatestResult,
  getResults,
  getMarks,
  getBackPapers,
  applyBackPaper,
  getMarksheets,
  getStudentProfile,
  getSemesterResult,
  getSemesterMarks,
};
