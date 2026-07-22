const semesterRegistrationService = require("../services/semesterRegistration.service");

class SemesterRegistrationController {
  async getMyRegistration(req, res) {
    try {
      const registration = await semesterRegistrationService.getMyRegistration(
        req.user.id,
      );

      res.status(200).json({
        success: true,
        data: registration,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async registerSemester(req, res) {
    try {
      const registration = await semesterRegistrationService.registerSemester(
        req.user.id,
      );

      res.status(201).json({
        success: true,
        message: "Semester registration submitted successfully",
        data: registration,
      });
    } catch (error) {
      console.error(error);

      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new SemesterRegistrationController();
