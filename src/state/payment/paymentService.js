import api from "@/lib/api";

export const getAllTransactions = async (filters = {}) => {
  try {
    const params = {};

    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.from_date) params.from_date = filters.from_date;
    if (filters.to_date) params.to_date = filters.to_date;

    const response = await api.get("/payment-payout/transactions", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const getAllRefunds = async (filters = {}) => {
  try {
    const params = {};

    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.from_date) params.from_date = filters.from_date;
    if (filters.to_date) params.to_date = filters.to_date;

    const response = await api.get("/payment-payout/refunds", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching refunds:", error);
    throw error;
  }
};

export const getTransactionDetails = async (transactionId) => {
  try {
    const response = await api.get(`/payment-payout/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transaction ${transactionId}:`, error);
    throw error;
  }
};

export const getPaymentStats = async () => {
  try {
    const response = await api.get("/payment-payout/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching payment stats:", error);
    throw error;
  }
};

export const initiateRefund = async (transactionId, payload) => {
  try {
    const response = await api.post(`/payment-payout/refund/${transactionId}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error initiating refund for transaction ${transactionId}:`, error);
    throw error;
  }
};
