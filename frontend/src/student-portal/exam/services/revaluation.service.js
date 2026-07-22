import api from "../../../auth/services/auth.service";

const revaluationService = {
  getSubjects: async () => {
    const { data } = await api.get("/revaluation/subjects");
    return data.data;
  },

  getApplications: async () => {
    const { data } = await api.get("/revaluation/applications");
    return data.data;
  },

  apply: async (payload) => {
    const { data } = await api.post("/revaluation/apply", payload);

    return data.data;
  },
};

export default revaluationService;
