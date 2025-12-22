import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDashboardSummary, getTodayAppointments, getTopPerformingStylist, getTopSellingProducts, getRecentActivities, getBookingOverview } from "@/state/dashboard/dashboardService";

// Async thunk to fetch dashboard summary
export const fetchDashboardSummary = createAsyncThunk(
  "dashboard/fetchSummary",
  async () => {
    const data = await getDashboardSummary();
    return data.summaryBoxes || data.summary;
  }
);

export const fetchTodayAppointments = createAsyncThunk(
  "dashboard/fetchTodayAppointments",
  async () => {
    const data = await getTodayAppointments();
    return data;
  }
);

export const fetchTopPerformingStylist = createAsyncThunk(
  "dashboard/fetchTopPerformingStylist",
  async () => {
    const data = await getTopPerformingStylist();
    return data;
  }
);

export const fetchTopSellingProducts = createAsyncThunk(
  "dashboard/fetchTopSellingProducts",
  async () => {
    const data = await getTopSellingProducts();
    return data;
  }
);

export const fetchRecentActivities = createAsyncThunk(
  "dashboard/fetchRecentActivities",
  async () => {
    const data = await getRecentActivities();
    return data;
  }
);

export const fetchBookingOverview = createAsyncThunk(
  "dashboard/fetchBookingOverview",
  async ({ filter = "year", year, month }) => {
    const data = await getBookingOverview({ filter, year, month });
    return data;
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    summaryBoxes: [],
    todayAppointments: null,
    stylists: [],
    products: [],
    activities: [],
    bookingOverview: {
      filter: "year",
      year: new Date().getFullYear(),
      month: null,
      data: [],
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summaryBoxes = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTodayAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodayAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.todayAppointments = action.payload;
      })
      .addCase(fetchTodayAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTopPerformingStylist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopPerformingStylist.fulfilled, (state, action) => {
        state.loading = false;
        const incoming = action.payload?.stylists || [];
        state.stylists = incoming.map((s) => ({
          rank: s.rank,
          stylist: { name: s.stylist, email: "", profile: "" },
          salon: s.salon,
          appointments: s.appointments,
          avg_rating: s.avgRating,
          revenue: s.revenueGenerated,
        }));
      })
      .addCase(fetchTopPerformingStylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTopSellingProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopSellingProducts.fulfilled, (state, action) => {
        state.loading = false;
        const incoming = action.payload?.products || [];
        state.products = incoming.map((p) => ({
          rank: p.rank,
          product: { name: p.productName, profile: p.productImage || "" },
          unit_sold: p.unitsSold,
          revenue: p.totalRevenue,
        }));
      })
      .addCase(fetchTopSellingProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchRecentActivities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.loading = false;
        const incoming = action.payload?.activities || [];
        state.activities = incoming.map((a, idx) => ({
          id: idx + 1,
          activity: {
            description: a.message,
            profile: a.user?.profile_picture || "/noimage.png",
            time: a.timeAgo,
          },
        }));
      })
      .addCase(fetchRecentActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchBookingOverview.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookingOverview.fulfilled, (state, action) => {
        state.loading = false;
        const filter = action.payload?.filter || "year";
        const incoming = action.payload?.data || [];
        // Map to chart rows: { label, bookingValue }
        const mapped = incoming.map((d) => ({
          label: String(d.label),
          bookingValue: Number(d.bookings || 0),
        }));
        state.bookingOverview.filter = filter;
        // Preserve year/month in state if present on request by reading meta.arg
        const arg = action.meta?.arg || {};
        if (arg.year) state.bookingOverview.year = Number(arg.year);
        state.bookingOverview.month = filter === "month" ? Number(arg.month || 0) : null;
        state.bookingOverview.data = mapped;
      })
      .addCase(fetchBookingOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dashboardSlice.reducer;