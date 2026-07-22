const feedbackRepository = require("../repositories/feedback.repository");

class FeedbackService {
  async getFaculties() {
    return await feedbackRepository.getFaculties();
  }

  async submitFeedback(studentId, feedbacks) {
    for (const feedback of feedbacks) {
      const exists = await feedbackRepository.checkFeedback(
        studentId,
        feedback.facultyId,
        feedback.semester,
      );

      if (exists) {
        continue;
      }

      await feedbackRepository.createFeedback({
        studentId,

        facultyId: feedback.facultyId,

        semester: feedback.semester,

        rating: feedback.rating,

        comment: feedback.comment,
      });
    }

    return true;
  }

  async getStudentFeedback(studentId) {
    return await feedbackRepository.getStudentFeedback(studentId);
  }
}

module.exports = new FeedbackService();
