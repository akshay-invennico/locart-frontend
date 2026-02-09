import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllClients,
  getClientDetails,
  createClient,
  updateClientById,
  getClientBookings,
  archiveClients,
  getClientOrders,
  suspendClients,
  reactivateClient,
} from "./clientService";

export const fetchClients = createAsyncThunk(
  "client/fetchClients",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await getAllClients(params);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const fetchClientById = createAsyncThunk(
  "client/fetchClientById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await getClientDetails(id);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const addClient = createAsyncThunk(
  "client/addClient",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await createClient(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const editClient = createAsyncThunk(
  "client/editClient",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const data = await updateClientById(id, payload);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const fetchClientBookings = createAsyncThunk(
  "clientBooking/fetchClientBookings",
  async (clientId) => {
    const data = await getClientBookings(clientId);
    return data;
  }
);

export const archiveClientsByIds = createAsyncThunk(
  "client/archiveClientsByIds",
  async ({ clientIds, reason }, { rejectWithValue }) => {
    try {
      const data = await archiveClients(clientIds, reason);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const fetchClientOrders = createAsyncThunk(
  "client/fetchClientOrders",
  async ({ clientId, params = {} }, { rejectWithValue }) => {
    try {
      const data = await getClientOrders(clientId, params);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const suspendClientsByIds = createAsyncThunk(
  "client/suspendClientsByIds",
  async ({ clientIds, reason }, { rejectWithValue }) => {
    try {
      const data = await suspendClients(clientIds, reason);
      return { data, clientIds };
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const reactivateClientById = createAsyncThunk(
  "client/reactivateClientById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await reactivateClient(id);
      return { data, id };
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

const clientSlice = createSlice({
  name: "client",
  initialState: {
    clients: [],
    summaryBoxes: [],
    client: null,
    loading: false,
    error: null,
    total: 0,
    filters: {},
    pagination: {
      page: 1,
      totalPages: 1,
      total: 0,
      limit: 10,
    },
  },
  reducers: {
    setClientFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearClient: (state) => {
      state.client = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        const { clients, meta } = action.payload || {};

        state.clients = Array.isArray(clients) ? clients : [];

        if (meta) {
          const { currentPage, totalPages, totalClients } = meta;
          state.pagination = {
            page: currentPage || 1,
            limit: 10,
            total: totalClients || 0,
            totalPages: totalPages || 1
          };
          state.total = totalClients || 0;
        } else {
          state.pagination = {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 1
          };
          state.total = 0;
        }
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch clients";
      })

      .addCase(fetchClientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.loading = false;
        state.client = action.payload?.client || null;
        state.summaryBoxes = action.payload?.summaryBoxes || [];
      })

      .addCase(fetchClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch client";
      })

      .addCase(addClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients.unshift(action.payload);
        state.total += 1;
      })
      .addCase(addClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add client";
      })

      .addCase(editClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editClient.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.clients.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        if (state.client?.id === action.payload.id) {
          state.client = action.payload;
        }
      })
      .addCase(editClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update client";
      })
      .addCase(fetchClientBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload?.bookings || [];
        state.bookingMeta = action.payload?.meta || {};
      })
      .addCase(fetchClientBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch bookings";
      })
      .addCase(archiveClientsByIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(archiveClientsByIds.fulfilled, (state, action) => {
        state.loading = false;
        const archivedIds = action.meta.arg.client_ids;
        state.clients = state.clients.filter(
          (c) => !archivedIds.includes(c._id)
        );
        state.total = state.clients.length;
      })
      .addCase(archiveClientsByIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchClientOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload?.orders || [];
        state.orderMeta = action.payload?.meta || {};
      })
      .addCase(fetchClientOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch client orders";
      })
      .addCase(suspendClientsByIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(suspendClientsByIds.fulfilled, (state, action) => {
        state.loading = false;
        const suspendedIds = action.payload.clientIds;
        state.clients = state.clients.map((client) =>
          suspendedIds.includes(client._id)
            ? { ...client, status: "suspended" }
            : client
        );
      })
      .addCase(suspendClientsByIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to suspend clients";
      })
      .addCase(reactivateClientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reactivateClientById.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload.id;
        state.clients = state.clients.map((client) =>
          client._id === id ? { ...client, status: "active" } : client
        );
      })
      .addCase(reactivateClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to reactivate client";
      });
  },
});
export const { setClientFilters, clearClient } = clientSlice.actions;
export default clientSlice.reducer;
