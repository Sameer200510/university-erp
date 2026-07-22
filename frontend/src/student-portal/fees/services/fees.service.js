import api from "../../../auth/services/auth.service";

export const feesService = {
  getDashboard: async () => {
    const response = await api.get("/fees/dashboard");
    return response.data.data;
  },

  getInstallments: async () => {
    const response = await api.get("/fees/installments");
    return response.data.data;
  },

  getPayments: async () => {
    const response = await api.get("/fees/payments");
    return response.data.data;
  },

  getReceipts: async () => {
    const response = await api.get("/fees/receipts");
    return response.data.data;
  },

  downloadReceipt: async (receiptId) => {
    const response = await api.get(`/fees/receipt/${receiptId}`);

    return response.data;
  },
};
