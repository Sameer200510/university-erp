const examRepository = require("../repositories/exam.repository");
const marksheetPdfService = require("./marksheetPdf.service");

async function getDashboard(studentId) {
  const result = await examRepository.getLatestResult(studentId);

  return {
    currentSemester: result?.semester || 0,
    sgpa: result?.sgpa || 0,
    cgpa: result?.cgpa || 0,
    backPapers: result?.backPapers || 0,
  };
}

async function getResults(studentId) {
  return examRepository.getResults(studentId);
}

async function getMarks(studentId) {
  return examRepository.getMarks(studentId);
}

async function getMarksheets(studentId) {
  return examRepository.getMarksheets(studentId);
}

async function getBackPapers(studentId) {
  return examRepository.getBackPapers(studentId);
}

async function applyBackPaper(studentId, body) {
  return examRepository.applyBackPaper({
    studentId,

    subjectCode: body.subjectCode,
    subjectName: body.subjectName,

    semester: Number(body.semester),

    fee: 1500,
  });
}

async function downloadMarksheet(studentId, semester, res) {
  return marksheetPdfService.generate(studentId, semester, res);
}

module.exports = {
  getDashboard,
  getResults,
  getMarks,
  getBackPapers,
  applyBackPaper,
  getMarksheets,
  downloadMarksheet,
};
