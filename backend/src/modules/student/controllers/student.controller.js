const studentService = require("../services/student.service");

class StudentController {
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const profile = await studentService.getProfile(userId);
      res.status(200).json({ profile });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;

      const {
        firstName,
        lastName,
        dob,
        phone,
        address,
        course,
        rollNo,
        enrollmentNo,
        branch,
        section,
        currentSemester,
        cgpa,
      } = req.body;

      const profileData = {
        firstName,
        lastName,
        dob: dob ? new Date(dob) : null,
        phone,
        address,
        course,

        rollNo,
        enrollmentNo,
        branch,
        section,
        currentSemester,
        cgpa,
      };

      const profile = await studentService.updateProfile(userId, profileData);

      res.status(200).json({
        message: "Profile updated",
        profile,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}

module.exports = new StudentController();
