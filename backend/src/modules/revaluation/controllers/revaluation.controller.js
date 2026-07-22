const service = require("../services/revaluation.service");

async function getSubjects(req, res) {
  const data = await service.getSubjects(req.user.id);

  res.json({
    success: true,
    data,
  });
}

async function getApplications(req, res) {
  const data = await service.getApplications(req.user.id);

  res.json({
    success: true,
    data,
  });
}

async function apply(req, res) {
  const data = await service.apply(req.user.id, req.body);

  res.json({
    success: true,
    message: "Revaluation Applied Successfully",
    data,
  });
}

module.exports = {
  getSubjects,
  getApplications,
  apply,
};
