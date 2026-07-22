const feedbackService = require("../services/feedback.service");

class FeedbackController {
  async getFaculties(req, res) {
    try {
      const faculties = await feedbackService.getFaculties();

      res.status(200).json({
        success: true,
        data: faculties,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async submitFeedback(req, res) {
    try {
      await feedbackService.submitFeedback(req.user.id, req.body.feedbacks);

      res.status(200).json({
        success: true,
        message: "Feedback Submitted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getMyFeedback(req, res) {
    try {
      const feedbacks = await feedbackService.getStudentFeedback(req.user.id);

      res.status(200).json({
        success: true,
        data: feedbacks,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new FeedbackController();
