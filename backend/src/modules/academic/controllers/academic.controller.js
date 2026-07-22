const academicService = require("../services/academic.service");

class AcademicController {
  async getSubjects(req, res) {
    try {
      const subjects = await academicService.getSubjects();

      res.status(200).json({
        success: true,
        data: subjects,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAttendance(req, res) {
    try {
      const studentId = req.user.id;

      const attendance = await academicService.getAttendance(studentId);

      res.status(200).json({
        success: true,
        data: attendance,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getMarks(req, res) {
    try {
      const marks = await academicService.getMarks();

      res.status(200).json({
        success: true,
        data: marks,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getResults(req, res) {
    try {
      const studentId = req.user.id;

      const results = await academicService.getResults(studentId);

      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAttendanceDetails(req, res) {
    try {
      const studentId = req.user.id;

      const { subjectId } = req.params;

      const attendance = await academicService.getAttendanceDetails(
        studentId,
        subjectId,
      );

      res.status(200).json({
        success: true,
        data: attendance,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AcademicController();
