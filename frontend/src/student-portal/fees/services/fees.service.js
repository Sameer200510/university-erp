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

  getStudentLedger: async () => {
    const response = await api.get("/fees/ledger");
    return response.data.data;
  },

  getStudentInvoices: async () => {
    const response = await api.get("/fees/invoices");
    return response.data.data;
  },

  payOnline: async (data) => {
    const response = await api.post("/fees/pay-online", data);
    return response.data.data;
  },

  downloadReceipt: async (receiptId) => {
    const response = await api.get(`/fees/receipt/${receiptId}`);
    return response.data;
  },
};
