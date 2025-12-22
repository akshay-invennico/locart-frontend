import { api } from "@/lib/api";

export const getAll = async () => {
  try {
    const response = await api.get("/notification");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch notifications"
    );
  }
};

export const markAsRead = async () => {
  try {
    const response = await api.patch(`/notification/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};



