import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getStoreDetails,
  getStoreServices,
  editStore,
  deleteService,
  updateService,
  getAllAmenities,
  addAmenity,
  addService,
  getStoreById,
  getAllHolidays,
  addHoliday,
  deleteHoliday,
  updateHoliday,
  createStore
} from "./storeService";

export const storeCreate = createAsyncThunk(
  "store/createStore",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createStore(data);
      return res;
    } catch (error) {
      return rejectWithValue(error.message || "Error in create store hook");
    }
  }
);

export const updateStore = createAsyncThunk(
  "store/updateStore",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await editStore(id, data);
      return res;
    } catch (error) {
      return rejectWithValue(error.message || "Update failed");
    }
  }
);

export const fetchStoreDetails = createAsyncThunk(
  "store/fetchStoreDetails",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getStoreDetails();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch store details");
    }
  }
);

export const fetchStoreServices = createAsyncThunk(
  "store/fetchStoreServices",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const res = await getStoreServices(filters);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch store services");
    }
  }
);

export const removeService = createAsyncThunk(
  "services/removeService",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteService(id);
      return res.data.id;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete service");
    }
  }
);

export const editService = createAsyncThunk(
  "services/editService",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateService(id, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update service");
    }
  }
);

export const createService = createAsyncThunk(
  "services/createService",
  async (data, { rejectWithValue }) => {
    try {
      const newService = await addService(data);
      return newService;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create service");
    }
  }
);

export const fetchAllAmenities = createAsyncThunk(
  "store/fetchAllAmenities",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllAmenities();
      return res || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createAmenity = createAsyncThunk(
  "store/createAmenity",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await addAmenity(payload);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStoreById = createAsyncThunk(
  "store/fetchStoreById",
  async (storeId, thunkAPI) => {
    try {
      const res = await getStoreById(storeId);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchAllHolidays = createAsyncThunk(
  "store/fetchAllHolidays",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllHolidays();
      return res.data || [];
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch holidays");
    }
  }
);

export const createHoliday = createAsyncThunk(
  "store/createHoliday",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await addHoliday(payload);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeHoliday = createAsyncThunk(
  "store/removeHoliday",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteHoliday(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete holiday");
    }
  }
);

export const editHoliday = createAsyncThunk(
  "store/editHoliday",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateHoliday(id, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update holiday");
    }
  }
);

const storeSlice = createSlice({
  name: "store",
  initialState: {
    store: null,
    services: [],
    pagination: null,
    loading: false,
    error: null,
    amenities: [],
    holidays: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.store = action.payload;
      })
      .addCase(fetchStoreDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStoreById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreById.fulfilled, (state, action) => {
        state.loading = false;
        state.store = action.payload;
      })
      .addCase(fetchStoreById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        state.loading = false;
        state.store = action.payload;
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStoreServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload.services || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchStoreServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeService.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeService.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.services = state.services.filter(
          (service) => service._id !== deletedId
        );
      })
      .addCase(removeService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editService.pending, (state) => {
        state.loading = true;
      })
      .addCase(editService.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.data || action.payload;

        if (!updated?._id) return;

        const mapped = {
          _id: updated._id,
          serviceName: updated.name,
          iconUrl: updated.icon,
          basePrice: updated.base_price,
          duration: updated.duration,
          serviceStatus:
            updated.status?.charAt(0).toUpperCase() + updated.status.slice(1),
        };

        state.services = state.services.map((service) =>
          service._id === mapped._id ? { ...service, ...mapped } : service
        );
      })
      .addCase(editService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.push(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllAmenities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAmenities.fulfilled, (state, action) => {
        state.loading = false;
        state.amenities = action.payload || [];
      })
      .addCase(fetchAllAmenities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAmenity.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAmenity.fulfilled, (state, action) => {
        state.loading = false;
        state.amenities.push(action.payload);
      })
      .addCase(createAmenity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllHolidays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllHolidays.fulfilled, (state, action) => {
        state.loading = false;
        state.holidays = action.payload || [];
      })
      .addCase(fetchAllHolidays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHoliday.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(state.holidays)) state.holidays = [];
        state.holidays.push(action.payload);
      })
      .addCase(createHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeHoliday.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeHoliday.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg;

        state.holidays = state.holidays.filter(
          (holiday) => holiday._id !== deletedId
        );
      })
      .addCase(removeHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editHoliday.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;

        state.holidays = state.holidays.map((h) =>
          h._id === updated._id ? { ...h, ...updated } : h
        );
      })
      .addCase(editHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default storeSlice.reducer;
