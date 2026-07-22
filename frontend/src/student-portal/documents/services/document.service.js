import api from "../../../auth/services/auth.service";

export const documentService = {
  getDocuments: async () => {
    const response = await api.get("/document/my-documents");
    return response.data.documents;
  },

  uploadDocument: async (formData) => {
    const response = await api.post("/document/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.document;
  },

  deleteDocument: async (id) => {
    const response = await api.delete(`/document/${id}`);
    return response.data;
  },
};
