import { api } from "@/lib/api";

export const getDashboardSummary = async () => {
  try {
    const { data } = await api.get("/dashboard/summary");
    return data;
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    throw error;
  }
};

export const getTodayAppointments = async () => {
  try {
    const { data } = await api.get("/dashboard/today-appointments");
    return data;
  } catch (error) {
    console.error("Error fetching today appointments:", error);
    throw error;
  }
};

export const getTopPerformingStylist = async () => {
  try {
    const { data } = await api.get("/dashboard/top-stylists?limit=5");
    return data;
  } catch (error) {
    console.error("Error fetching top performing stylist:", error);
    throw error;
  }
};

export const getTopSellingProducts = async () => {
  try {
    const { data } = await api.get("/dashboard/top-selling-products");
    return data;
  } catch (error) {
    console.error("Error fetching top selling products:", error);
    throw error;
  }
};

export const getRecentActivities = async () => {
  try {
    const { data } = await api.get("/dashboard/recent-activities");
    return data;
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    throw error;
  }
};

export const getBookingOverview = async ({ filter = "year", year, month }) => {
  try {
    const params = new URLSearchParams();
    if (filter) params.append("filter", filter);
    if (year) params.append("year", year);
    if (filter === "month" && month) params.append("month", month);

    const { data } = await api.get(`/dashboard/booking-overview/?${params.toString()}`);
    return data;
  } catch (error) {
    console.error("Error fetching booking overview:", error);
    throw error;
  }
};
