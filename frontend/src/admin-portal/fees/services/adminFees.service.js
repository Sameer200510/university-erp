import api from "../../../auth/services/auth.service";

export const adminFeesService = {
  getDashboard: async () => {
    const response = await api.get("/fees/admin/dashboard");
    return response.data.data;
  },

  getFeeHeads: async () => {
    const response = await api.get("/fees/admin/heads");
    return response.data.data;
  },

  createFeeHead: async (data) => {
    const response = await api.post("/fees/admin/heads", data);
    return response.data.data;
  },

  getFeeMatrix: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.courseId) params.append("courseId", filters.courseId);
    if (filters.batch) params.append("batch", filters.batch);
    if (filters.quota) params.append("quota", filters.quota);
    if (filters.semester) params.append("semester", filters.semester);

    const response = await api.get(`/fees/admin/matrix?${params.toString()}`);
    return response.data.data;
  },

  saveFeeMatrixRule: async (data) => {
    const response = await api.post("/fees/admin/matrix", data);
    return response.data.data;
  },

  generateSemesterInvoices: async (data) => {
    const response = await api.post("/fees/admin/invoice/generate", data);
    return response.data.data;
  },

  collectOfflinePayment: async (data) => {
    const response = await api.post("/fees/admin/collect-offline", data);
    return response.data.data;
  },

  markChequeBounce: async (transactionId, fineAmount = 1000) => {
    const response = await api.post(`/fees/admin/transaction/${transactionId}/bounce`, { fineAmount });
    return response.data.data;
  },

  applyLateFees: async () => {
    const response = await api.post("/fees/admin/dunning/apply-late-fees");
    return response.data.data;
  },

  sendReminders: async () => {
    const response = await api.post("/fees/admin/dunning/send-reminders");
    return response.data.data;
  },
};
