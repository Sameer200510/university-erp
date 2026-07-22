const repository = require("../repositories/revaluation.repository");

async function getSubjects(studentId) {
  return repository.getSubjects(studentId);
}

async function getApplications(studentId) {
  return repository.getApplications(studentId);
}

async function apply(studentId, body) {
  return repository.createApplication({
    studentId,
    subjectId: body.subjectId,
    semester: Number(body.semester),
    reason: body.reason,
    fee: 1000,
  });
}

module.exports = {
  getSubjects,
  getApplications,
  apply,
};
