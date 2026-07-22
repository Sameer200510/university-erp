import api from "../../../auth/services/auth.service";

export const dashboardService = {
  async getProfile() {
    const response = await api.get("/student/profile");
    return response.data.profile;
  },

  async getAttendance() {
    const response = await api.get("/academic/attendance");
    return response.data.data;
  },

  async getSubjects() {
    const response = await api.get("/academic/subjects");
    return response.data.data;
  },

  async getResults() {
    const response = await api.get("/academic/results");
    return response.data.data;
  },
};
