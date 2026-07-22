const examService = require("../service/exam.service");

async function getDashboard(req, res) {
  const data = await examService.getDashboard(req.user.id);

  res.json({
    success: true,
    data,
  });
}

async function getResults(req, res) {
  const data = await examService.getResults(req.user.id);

  res.json({
    success: true,
    data,
  });
}

async function getMarks(req, res) {
  const data = await examService.getMarks(req.user.id);

  res.json({
    success: true,
    data,
  });
}

async function getBackPapers(req, res) {
  const data = await examService.getBackPapers(req.user.id);

  res.json({
    success: true,
    data,
  });
}

async function applyBackPaper(req, res) {
  const data = await examService.applyBackPaper(req.user.id, req.body);

  res.json({
    success: true,
    message: "Back Paper Applied Successfully",
    data,
  });
}

async function getMarksheets(req, res) {
  const data = await examService.getMarksheets(req.user.id);

  res.json({
    success: true,
    data,
  });
}

async function downloadMarksheet(req, res) {
  await examService.downloadMarksheet(
    req.user.id,
    Number(req.params.semester),
    res,
  );
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
