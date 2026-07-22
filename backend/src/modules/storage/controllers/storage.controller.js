const studentService = require("../../student/services/student.service");

class StorageController {
  async uploadProfilePhoto(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const photoUrl = `/uploads/profile-images/${req.file.filename}`;

      await studentService.updatePhoto(req.user.id, photoUrl);

      return res.status(200).json({
        success: true,
        photoUrl,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new StorageController();
