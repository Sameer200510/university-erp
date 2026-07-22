import api from "../../../auth/services/auth.service";

const circularService = {
  getCirculars: async () => {
    const { data } = await api.get("/circular");

    return data.data;
  },
};

export default circularService;
