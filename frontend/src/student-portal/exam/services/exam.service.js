import api from "../../../auth/services/auth.service";

const examService = {
  getDashboard: async () => {
    const { data } = await api.get("/exam/dashboard");
    return data.data;
  },

  getResults: async () => {
    const { data } = await api.get("/exam/results");
    return data.data;
  },

  getMarks: async () => {
    const { data } = await api.get("/exam/marks");
    return data.data;
  },

  getBackPapers: async () => {
    const { data } = await api.get("/exam/back-papers");
    return data.data;
  },

  applyBackPaper: async (payload) => {
    const { data } = await api.post("/exam/back-papers", payload);
    return data.data;
  },

  getAdmitCardEligibility: async () => {
    const { data } = await api.get("/admit-card/eligibility");

    return data.data;
  },

  getMarksheets: async () => {
    const { data } = await api.get("/exam/marksheets");
    return data.data;
  },

  generateAdmitCard: async () => {
    const { data } = await api.post("/admit-card/generate");

    return data.data;
  },

  downloadMarksheet: async (semester) => {
    const response = await api.get(`/exam/marksheets/${semester}/download`, {
      responseType: "blob",
    });

    return response.data;
  },
};

export default examService;
