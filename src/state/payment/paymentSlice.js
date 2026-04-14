import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllTransactions,
  getAllRefunds,
  getTransactionDetails,
  getPaymentStats,
  initiateRefund,
} from "./paymentService";

export const fetchAllTransactions = createAsyncThunk(
  "payment/fetchAllTransactions",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await getAllTransactions(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching transactions");
    }
  }
);

export const fetchAllRefunds = createAsyncThunk(
  "payment/fetchAllRefunds",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await getAllRefunds(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching refunds");
    }
  }
);

export const fetchTransactionDetails = createAsyncThunk(
  "payment/fetchTransactionDetails",
  async (transactionId, { rejectWithValue }) => {
    try {
      const response = await getTransactionDetails(transactionId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching transaction details");
    }
  }
);

export const fetchPaymentStats = createAsyncThunk(
  "payment/fetchPaymentStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPaymentStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching payment stats");
    }
  }
);

export const refundTransaction = createAsyncThunk(
  "payment/refundTransaction",
  async ({ transactionId, reason }, { rejectWithValue }) => {
    try {
      const response = await initiateRefund(transactionId, { reason });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error processing refund");
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    transactions: [],
    refunds: [],
    selectedTransaction: null,
    stats: null,
    loading: false,
    detailLoading: false,
    refundLoading: false,
    statsLoading: false,
    error: null,
    transactionPagination: {
      page: 1,
      totalPages: 1,
      total: 0,
      limit: 10,
    },
    refundPagination: {
      page: 1,
      totalPages: 1,
      total: 0,
      limit: 10,
    },
  },
  reducers: {
    clearSelectedTransaction: (state) => {
      state.selectedTransaction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.loading = false;
        const { data, pagination } = action.payload || {};
        state.transactions = Array.isArray(data) ? data : [];
        if (pagination) {
          state.transactionPagination = {
            page: pagination.page || 1,
            limit: pagination.limit || 10,
            total: pagination.total || 0,
            totalPages: pagination.totalPages || 1,
          };
        }
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllRefunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRefunds.fulfilled, (state, action) => {
        state.loading = false;
        const { data, pagination } = action.payload || {};
        state.refunds = Array.isArray(data) ? data : [];
        if (pagination) {
          state.refundPagination = {
            page: pagination.page || 1,
            limit: pagination.limit || 10,
            total: pagination.total || 0,
            totalPages: pagination.totalPages || 1,
          };
        }
      })
      .addCase(fetchAllRefunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchTransactionDetails.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(fetchTransactionDetails.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedTransaction = action.payload?.data || action.payload;
      })
      .addCase(fetchTransactionDetails.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchPaymentStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchPaymentStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload?.data || action.payload;
      })
      .addCase(fetchPaymentStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      })

      .addCase(refundTransaction.pending, (state) => {
        state.refundLoading = true;
      })
      .addCase(refundTransaction.fulfilled, (state) => {
        state.refundLoading = false;
      })
      .addCase(refundTransaction.rejected, (state, action) => {
        state.refundLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedTransaction } = paymentSlice.actions;
export default paymentSlice.reducer;
