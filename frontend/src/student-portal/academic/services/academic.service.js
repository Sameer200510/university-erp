import api from "../../../auth/services/auth.service";

export const academicService = {
  getAttendance: async () => {
    const response = await api.get("/academic/attendance");
    return response.data.data;
  },

  getAttendanceDetails: async (subjectId) => {
    const response = await api.get(`/academic/attendance/${subjectId}`);

    return response.data.data;
  },

  getResults: async () => {
    const response = await api.get("/academic/results");
    return response.data.data;
  },

  getSubjects: async () => {
    const response = await api.get("/academic/subjects");
    return response.data.data;
  },

  getSemesterRegistration: async () => {
    const response = await api.get("/semester-registration/my-registration");

    return response.data.data;
  },

  registerSemester: async () => {
    const response = await api.post("/semester-registration/register");

    return response.data;
  },

  getFaculties: async () => {
    const response = await api.get("/feedback/faculties");

    return response.data.data;
  },

  submitFeedback: async (feedbacks) => {
    const response = await api.post("/feedback/submit", {
      feedbacks,
    });

    return response.data;
  },
  getMyFeedback: async () => {
    const response = await api.get("/feedback/my-feedback");

    return response.data.data;
  },
};
