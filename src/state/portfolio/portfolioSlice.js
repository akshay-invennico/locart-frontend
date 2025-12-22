import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllPortfolios,
  getPortfolioById,
  createPortfolio,
} from "./portfolioService";

export const fetchPortfolios = createAsyncThunk(
  "portfolio/fetchPortfolios",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const res = await getAllPortfolios(filters);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch portfolios");
    }
  }
);

export const fetchPortfolioById = createAsyncThunk(
  "portfolio/fetchPortfolioById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getPortfolioById(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch portfolio");
    }
  }
);

export const createNewPortfolio = createAsyncThunk(
  "portfolio/createPortfolio",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createPortfolio(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create portfolio");
    }
  }
);

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState: {
    list: [],        
    single: null,    
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolios.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchPortfolios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPortfolioById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolioById.fulfilled, (state, action) => {
        state.loading = false;
        state.single = action.payload || null;
      })
      .addCase(fetchPortfolioById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createNewPortfolio.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createNewPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default portfolioSlice.reducer;
