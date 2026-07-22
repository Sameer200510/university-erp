import api from "../../../auth/services/auth.service";

export const profileService = {
  getProfile: async () => {
    const response = await api.get("/student/profile");
    return response.data.profile;
  },

  updateProfile: async (profileData) => {
    const response = await api.post("/student/profile", profileData);
    return response.data.profile;
  },

  uploadPhoto: async (file) => {
    const formData = new FormData();

    formData.append("photo", file);

    const response = await api.post("/storage/profile-photo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};
