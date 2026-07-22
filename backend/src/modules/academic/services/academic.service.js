const academicRepository = require("../repositories/academic.repository");

class AcademicService {
  async getSubjects() {
    return await academicRepository.getSubjects();
  }

  async getAttendance(studentId) {
    return await academicRepository.getAttendance(studentId);
  }

  async getMarks() {
    return await academicRepository.getMarks();
  }

  async getResults(studentId) {
    return await academicRepository.getResults(studentId);
  }

  async getAttendanceDetails(studentId, subjectId) {
    return await academicRepository.getAttendanceDetails(studentId, subjectId);
  }
}

module.exports = new AcademicService();
